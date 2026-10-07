from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Route53 Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/hosted-zones", response_model=list[schemas.HostedZone])
def read_hosted_zones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    zones = crud.get_hosted_zones(db, skip=skip, limit=limit)
    return zones

@app.post("/api/hosted-zones", response_model=schemas.HostedZone)
def create_hosted_zone(zone: schemas.HostedZoneCreate, db: Session = Depends(get_db)):
    return crud.create_hosted_zone(db=db, zone=zone)

@app.get("/api/hosted-zones/{zone_id}", response_model=schemas.HostedZoneDetail)
def read_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    db_zone = crud.get_hosted_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    # Fetch records explicitly for the detail view
    records = crud.get_records(db, zone_id=zone_id)
    db_zone.records = records
    return db_zone

@app.delete("/api/hosted-zones/{zone_id}", response_model=schemas.HostedZone)
def delete_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    db_zone = crud.delete_hosted_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return db_zone

@app.put("/api/hosted-zones/{zone_id}", response_model=schemas.HostedZone)
def update_hosted_zone(zone_id: str, zone: schemas.HostedZoneCreate, db: Session = Depends(get_db)):
    db_zone = crud.update_hosted_zone(db, zone_id=zone_id, zone=zone)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return db_zone

@app.get("/api/hosted-zones/{zone_id}/records", response_model=list[schemas.ResourceRecord])
def read_records(zone_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    records = crud.get_records(db, zone_id=zone_id, skip=skip, limit=limit)
    return records

@app.post("/api/hosted-zones/{zone_id}/records", response_model=schemas.ResourceRecord)
def create_record(zone_id: str, record: schemas.ResourceRecordCreate, db: Session = Depends(get_db)):
    # Verify zone exists
    db_zone = crud.get_hosted_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return crud.create_record(db=db, record=record, zone_id=zone_id)

@app.delete("/api/records/{record_id}", response_model=schemas.ResourceRecord)
def delete_record(record_id: int, db: Session = Depends(get_db)):
    db_record = crud.delete_record(db, record_id=record_id)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return db_record

@app.put("/api/records/{record_id}", response_model=schemas.ResourceRecord)
def update_record(record_id: int, record: schemas.ResourceRecordCreate, db: Session = Depends(get_db)):
    db_record = crud.update_record(db, record_id=record_id, record=record)
    if db_record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return db_record
