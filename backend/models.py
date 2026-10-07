from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    caller_reference = Column(String, unique=True)
    comment = Column(String, default="")
    private_zone = Column(Boolean, default=False)
    record_set_count = Column(Integer, default=0)

    records = relationship("ResourceRecord", back_populates="zone", cascade="all, delete")

class ResourceRecord(Base):
    __tablename__ = "resource_records"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(String, ForeignKey("hosted_zones.id"))
    name = Column(String, index=True)
    type = Column(String)
    ttl = Column(Integer)
    value = Column(String)
    routing_policy = Column(String, default="Simple")

    zone = relationship("HostedZone", back_populates="records")
