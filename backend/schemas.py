from pydantic import BaseModel
from typing import List, Optional

class ResourceRecordBase(BaseModel):
    name: str
    type: str
    ttl: int
    value: str
    routing_policy: Optional[str] = "Simple"

class ResourceRecordCreate(ResourceRecordBase):
    pass

class ResourceRecord(ResourceRecordBase):
    id: int
    zone_id: str

    class Config:
        orm_mode = True

class HostedZoneBase(BaseModel):
    name: str
    comment: Optional[str] = ""
    private_zone: Optional[bool] = False

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZone(HostedZoneBase):
    id: str
    caller_reference: str
    record_set_count: int

    class Config:
        orm_mode = True

class HostedZoneDetail(HostedZone):
    records: List[ResourceRecord] = []
