-- ============================================================
-- REALTY AI — DUMMY SEED DATA
-- Run AFTER schema.sql
-- ============================================================

-- Fixed demo org id so it matches .env ORG_ID default
insert into organizations (id, name, city_focus, hours, contact_phone, allowed_discount_pct)
values (
  '00000000-0000-0000-0000-000000000001',
  'Skyline Realty',
  'Noida, Greater Noida, Gurgaon, Pune',
  'Mon-Sat 10:00-19:00 IST',
  '+91-9999999999',
  2.5
)
on conflict (id) do nothing;

-- Clear old demo properties for idempotent re-seeding
delete from properties where org_id = '00000000-0000-0000-0000-000000000001';

insert into properties
(org_id, project_name, developer, city, locality, property_type, bhk, price_min, price_max, size_sqft, status, possession_date, furnishing, floor_info, facing, amenities, rera_number, description, purpose)
values
('00000000-0000-0000-0000-000000000001','Skyline Heights','Skyline Group','Noida','Sector 150','apartment',3,12500000,13500000,1650,'available','2026-12-01','semi-furnished','12th of 28, multiple units','East',
  ARRAY['clubhouse','swimming pool','gym','24x7 security','children play area'],'UPRERAPRJ123001',
  'Premium high-rise 3 BHK towers facing the golf course expressway, close to Sector 150 metro corridor.', 'buy'),

('00000000-0000-0000-0000-000000000001','Skyline Heights','Skyline Group','Noida','Sector 150','apartment',2,8200000,8900000,1150,'available','2026-12-01','unfurnished','8th of 28, multiple units','North',
  ARRAY['clubhouse','swimming pool','gym','24x7 security'],'UPRERAPRJ123001',
  '2 BHK units in the same premium Skyline Heights tower, good for first-time buyers.', 'buy'),

('00000000-0000-0000-0000-000000000001','Green Meadows','Ashiana Developers','Greater Noida','Techzone 4','apartment',2,4800000,5500000,980,'available','2025-06-01','unfurnished','Various floors','South',
  ARRAY['park facing','jogging track','security'],'UPRERAPRJ123045',
  'Affordable ready-to-move 2 BHK society, popular with young families and IT professionals.', 'buy'),

('00000000-0000-0000-0000-000000000001','Green Meadows','Ashiana Developers','Greater Noida','Techzone 4','apartment',3,6200000,6900000,1280,'available','2025-06-01','unfurnished','Various floors','West',
  ARRAY['park facing','jogging track','security'],'UPRERAPRJ123045',
  '3 BHK option in the same ready-to-move Green Meadows society.', 'buy'),

('00000000-0000-0000-0000-000000000001','The Camellias','DLF Ltd','Gurgaon','Sector 42','apartment',4,42000000,48000000,4200,'available','2025-01-01','furnished','Low-rise, private lift','East',
  ARRAY['golf course view','private pool access','concierge','spa'],'HRERAPRJ990011',
  'Ultra-luxury 4 BHK residences overlooking the DLF Golf Course, for high-net-worth buyers.', 'buy'),

('00000000-0000-0000-0000-000000000001','Emerald Court','Emaar India','Gurgaon','Sector 65','apartment',3,15000000,16800000,1900,'available','2026-03-01','semi-furnished','15th of 32','North-East',
  ARRAY['clubhouse','rooftop pool','co-working lounge','gym'],'HRERAPRJ990033',
  '3 BHK in a Golf Course Extension Road high-rise, close to Sohna Road.', 'buy'),

('00000000-0000-0000-0000-000000000001','Emerald Court','Emaar India','Gurgaon','Sector 65','apartment',2,10500000,11200000,1350,'available','2026-03-01','semi-furnished','6th of 32','South',
  ARRAY['clubhouse','rooftop pool','gym'],'HRERAPRJ990033',
  '2 BHK units in the same Emerald Court tower.', 'buy'),

('00000000-0000-0000-0000-000000000001','Urban Nest','Mahindra Lifespaces','Pune','Hinjewadi Phase 2','apartment',2,6800000,7500000,1050,'available','2025-09-01','unfurnished','Various floors','East',
  ARRAY['IT park proximity','gym','kids play area','security'],'MHRERAPRJ550021',
  'Close to Hinjewadi IT hub, popular with tech professionals looking to buy near work.', 'buy'),

('00000000-0000-0000-0000-000000000001','Urban Nest','Mahindra Lifespaces','Pune','Hinjewadi Phase 2','apartment',3,8900000,9700000,1400,'available','2025-09-01','unfurnished','Various floors','West',
  ARRAY['IT park proximity','gym','kids play area','security'],'MHRERAPRJ550021',
  '3 BHK option in Urban Nest, Hinjewadi Phase 2.', 'buy'),

('00000000-0000-0000-0000-000000000001','Riverside Residency','Godrej Properties','Pune','Kharadi','apartment',2,7200000,7900000,1080,'reserved','2025-04-01','semi-furnished','9th of 20','River-facing',
  ARRAY['riverside walkway','clubhouse','gym'],'MHRERAPRJ550089',
  'River-facing 2 BHK in Kharadi — currently limited availability (mostly reserved).', 'buy'),

('00000000-0000-0000-0000-000000000001','Palm Residences','Signature Global','Gurgaon','Sector 37D','apartment',3,5400000,6100000,1200,'available','2025-08-01','unfurnished','Various floors','South',
  ARRAY['affordable housing','security','park'],'HRERAPRJ990077',
  'Affordable-housing category 3 BHK on Dwarka Expressway, good for budget buyers.', 'buy'),

('00000000-0000-0000-0000-000000000001','Metro Square Rentals','Local Developer','Noida','Sector 62','apartment',2,25000,32000,1000,'available',null,'furnished','Various floors','East',
  ARRAY['metro nearby','security','power backup'],null,
  'Furnished 2 BHK available for rent, walking distance to Sector 62 metro.', 'rent'),

('00000000-0000-0000-0000-000000000001','Metro Square Rentals','Local Developer','Noida','Sector 62','apartment',3,35000,42000,1300,'available',null,'furnished','Various floors','North',
  ARRAY['metro nearby','security','power backup'],null,
  'Furnished 3 BHK available for rent in the same Sector 62 society.', 'rent'),

('00000000-0000-0000-0000-000000000001','Cyber Heights Rentals','Local Developer','Gurgaon','DLF Cyber City','apartment',2,45000,55000,1150,'available',null,'furnished','Various floors','West',
  ARRAY['walk to office hub','gym','security'],null,
  'Fully furnished 2 BHK rentals close to DLF Cyber City, ideal for corporate tenants.', 'rent'),

('00000000-0000-0000-0000-000000000001','Sunrise Plots','Signature Global','Greater Noida','Yamuna Expressway','plot',null,3500000,9000000,null,'available','2027-01-01',null,null,null,
  ARRAY['gated township','road-facing plots'],'UPRERAPRJ123099',
  'Residential plots of varying sizes near the Yamuna Expressway / upcoming Jewar airport corridor.', 'buy');
