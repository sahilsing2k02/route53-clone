from sqlalchemy.orm import Session
import models, schemas
import uuid
import datetime

def get_hosted_zones(db: Session, skip: int = 0, limit: int = 100):
    zones = db.query(models.HostedZone).offset(skip).limit(limit).all()
    for z in zones:
        z.record_set_count = len(z.records)
    return zones

def get_hosted_zone(db: Session, zone_id: str):
    zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if zone:
        zone.record_set_count = len(zone.records)
    return zone

def create_hosted_zone(db: Session, zone: schemas.HostedZoneCreate):
    zone_id = "Z" + str(uuid.uuid4()).upper().replace("-", "")[:12]
    caller_reference = str(uuid.uuid4())
    db_zone = models.HostedZone(
        id=zone_id,
        name=zone.name,
        caller_reference=caller_reference,
        comment=zone.comment,
        private_zone=zone.private_zone,
        record_set_count=2 # Default SOA and NS records would go here, mock to 2
    )
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    
    # Create default NS and SOA records
    ns_record = models.ResourceRecord(
        zone_id=zone_id, name=zone.name, type="NS", ttl=172800, 
        value="ns-1.awsdns.net.\nns-2.awsdns.net.\nns-3.awsdns.net.\nns-4.awsdns.net."
    )
    soa_record = models.ResourceRecord(
        zone_id=zone_id, name=zone.name, type="SOA", ttl=900, 
        value="ns-1.awsdns.net. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
    )
    db.add(ns_record)
    db.add(soa_record)
    db.commit()
    
    return db_zone

def delete_hosted_zone(db: Session, zone_id: str):
    db_zone = get_hosted_zone(db, zone_id)
    if db_zone:
        zone_data = schemas.HostedZone.model_validate(db_zone)
        db.delete(db_zone)
        db.commit()
        return zone_data
    return None

def update_hosted_zone(db: Session, zone_id: str, zone: schemas.HostedZoneCreate):
    db_zone = get_hosted_zone(db, zone_id)
    if db_zone:
        db_zone.name = zone.name
        db_zone.comment = zone.comment
        db_zone.private_zone = zone.private_zone
        db.commit()
        db.refresh(db_zone)
    return db_zone

def get_records(db: Session, zone_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.ResourceRecord).filter(models.ResourceRecord.zone_id == zone_id).offset(skip).limit(limit).all()

def get_record(db: Session, record_id: int):
    return db.query(models.ResourceRecord).filter(models.ResourceRecord.id == record_id).first()

def create_record(db: Session, record: schemas.ResourceRecordCreate, zone_id: str):
    db_record = models.ResourceRecord(**record.model_dump(), zone_id=zone_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def delete_record(db: Session, record_id: int):
    db_record = get_record(db, record_id)
    if db_record:
        record_data = schemas.ResourceRecord.model_validate(db_record)
        db.delete(db_record)
        db.commit()
        return record_data
    return None

def update_record(db: Session, record_id: int, record: schemas.ResourceRecordCreate):
    db_record = get_record(db, record_id)
    if db_record:
        db_record.name = record.name
        db_record.type = record.type
        db_record.ttl = record.ttl
        db_record.value = record.value
        db_record.routing_policy = record.routing_policy
        db.commit()
        db.refresh(db_record)
    return db_record
