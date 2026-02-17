-- ============================================================
-- Control Tower: Seed Data
-- Real clients and projects from VBT Notion tracker (Feb 2026)
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- Clear existing data
TRUNCATE project_status_updates CASCADE;
TRUNCATE projects CASCADE;
TRUNCATE clients CASCADE;

-- ============================================================
-- CLIENTS
-- ============================================================

INSERT INTO clients (id, name) VALUES
  ('819e9c4e-7b46-4ce2-a68b-fe64a9bc20ec', 'Admazing'),
  ('f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'SME (School Management Enterprise)'),
  ('4f0c5458-8189-4452-9177-67859d2b6e81', 'bMedia'),
  ('fa15fd18-4d71-43ee-af93-3772d2896cdb', 'City Furniture'),
  ('8f4be4c4-e8f5-4b8e-8772-2ca2f995f184', 'Clear Packaging'),
  ('08e77528-3ef8-4b8a-a63f-59ec2ecc017d', 'Drawbridge'),
  ('18b8c280-e53c-4fd1-ad68-357e983933d8', 'Encore Vet Group'),
  ('ca66a992-f1f5-432f-be09-337bddd32210', 'Flagler / Azamara'),
  ('dbaf0008-bb42-4dfd-ac63-fc2bea8f9c9e', 'ID Fund'),
  ('a9a737aa-3652-4c07-b363-a2612e5b5183', 'LocalDrive'),
  ('3b64926a-df10-4786-9c45-e147cc004e88', 'MyLogistics.AI'),
  ('92809c4f-5aed-4fb4-8901-a7c849012f54', 'New Wave Loans'),
  ('da2ee52b-a7e3-4066-9e63-b41976687fd2', 'Office Practicum'),
  ('ecd56c77-83e8-49ed-a648-cbce0b4259fd', 'Online Vacation Center'),
  ('21bf7230-5de7-4fce-82a0-59b0b41dc941', 'Optima'),
  ('e3e5c51d-4eea-484c-b8ba-ad754dcb86d9', 'ST Paper'),
  ('f1aa4a30-381f-4b08-97f4-1c8d7c29afa6', 'The Shade Store'),
  ('bd2f8a52-647e-4c43-863b-b26fc97c62b1', 'WAGL'),
  ('acfdafca-c120-42dd-b69b-991b973f890e', 'World Emblem'),
  ('4acb560b-f050-4b6d-9b66-34499690fe2e', 'Xavier University'),
  ('3ebbcb98-747c-41ee-bdba-23e2637d3c78', 'ZeroFox'),
  ('d8eaf80d-6de9-4295-90d8-aeea81fc69d5', 'Sitemark'),
  ('3937760f-ca11-499f-a1d2-5318e15bca3d', 'Certify-Ed'),
  ('d03186a9-aa2b-4f25-93c2-fb3f448b5c4c', 'RPM Raceway'),
  ('f0e649af-dee1-4905-a2e7-201ab4cbf044', 'Flexcare'),
  ('d2c729b0-0aba-42ae-8a58-6a9a62fbbcf8', 'GOST'),
  ('00412753-fa4f-42ea-b14f-f820743755f4', 'Carnival'),
  ('1c54f934-4898-48f2-a40d-4ff661098983', 'Grant Thornton'),
  ('6dbcdabb-5c87-4943-b276-cc2a42a15a96', 'Revelocity'),
  ('bad11a72-7140-4825-9fb0-50ebde7aa6b5', 'Encoda'),
  ('ec6886c9-62bc-49e5-ba80-37b9e1461202', 'TrackFrame'),
  ('179e5123-0281-434f-b732-e58acf2dcf13', 'Bond');

-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO projects (id, name, client_id, type, status, owner, start_date) VALUES
  ('3e66abef-ed67-4afe-add5-ffa2c6a99a6f', 'Admazing', '819e9c4e-7b46-4ce2-a68b-fe64a9bc20ec', 'retainer', 'active', 'Danijel Latin', '2025-01-01'),
  ('29cbb00f-f851-4e8e-920f-860a3764ce40', 'SME - Algebra', 'f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'fixed', 'active', 'Danijel Latin', '2025-01-01'),
  ('443e1c60-6603-4c75-a68e-f412762c5589', 'SME - Avela', 'f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'fixed', 'active', 'Danijel Latin', '2025-01-01'),
  ('a659cf44-6f25-45f9-80b9-d217d7afaff4', 'SME - Stars', 'f9c0700e-79c6-4fc8-a2fe-73f82c5bad01', 'fixed', 'active', 'Danijel Latin', '2025-01-01'),
  ('293e5599-6d56-42e7-be81-22039563e0e7', 'bMedia', '4f0c5458-8189-4452-9177-67859d2b6e81', 'fixed', 'completed', 'Marianna Schiavino', '2025-10-01'),
  ('65a94050-84a5-4677-997e-ea0df632ad8f', 'CityFurniture - AIDaaS', 'fa15fd18-4d71-43ee-af93-3772d2896cdb', 'retainer', 'active', 'Danijel Latin', '2025-01-01'),
  ('8f129917-e941-454d-a603-ca25c5e41151', 'Clear Packaging', '8f4be4c4-e8f5-4b8e-8772-2ca2f995f184', 'fixed', 'active', 'Alex Wood', '2025-06-01'),
  ('ec48d1b9-0046-40bc-83e1-a9aae926798e', 'Drawbridge', '08e77528-3ef8-4b8a-a63f-59ec2ecc017d', 'retainer', 'active', 'Danijel Latin', '2025-01-01'),
  ('0ce4e00a-8eb2-440f-b2aa-6a7427f2e618', 'Encore Vet Group', '18b8c280-e53c-4fd1-ad68-357e983933d8', 'fixed', 'completed', 'Danijel Latin', '2025-09-01'),
  ('16d43650-e7dc-493e-b671-a6cb368ab324', 'Flagler / Azamara', 'ca66a992-f1f5-432f-be09-337bddd32210', 'fixed', 'completed', 'Danijel Latin', '2025-09-01'),
  ('5e3fc1b6-d38e-4d30-bbdc-0f0c19862230', 'ID Fund', 'dbaf0008-bb42-4dfd-ac63-fc2bea8f9c9e', 'retainer', 'active', 'Veljko Dragšić', '2025-01-01'),
  ('5bfa0883-475f-440b-8b7e-88a65fed0844', 'LocalDrive', 'a9a737aa-3652-4c07-b363-a2612e5b5183', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('f6dec078-0bb8-4f34-9ae8-11ce0f2c1af4', 'MyLogistics.AI', '3b64926a-df10-4786-9c45-e147cc004e88', 'fixed', 'active', 'Amber Gapinski', '2025-06-01'),
  ('00a5760b-15a1-44cb-ad1c-2e138257fbf6', 'New Wave Loans', '92809c4f-5aed-4fb4-8901-a7c849012f54', 'fixed', 'active', 'Amber Gapinski', '2025-06-01'),
  ('0288d505-1008-43d6-8f5e-867d9779779d', 'Office Practicum - Consulting / Support', 'da2ee52b-a7e3-4066-9e63-b41976687fd2', 'hourly', 'completed', 'Erica Briones', '2025-09-01'),
  ('2dc19e0b-c933-4782-bc9c-f3bea310b521', 'Online Vacation Center', 'ecd56c77-83e8-49ed-a648-cbce0b4259fd', 'retainer', 'active', 'Veljko Dragšić', '2025-01-01'),
  ('2a759d6e-f18e-46f0-8870-4cdb8e257fbf', 'Optima', '21bf7230-5de7-4fce-82a0-59b0b41dc941', 'fixed', 'active', 'Alex Wood', '2025-06-01'),
  ('e7f86ccb-f6d8-4bbf-a022-7bda590d9e8e', 'ST Paper', 'e3e5c51d-4eea-484c-b8ba-ad754dcb86d9', 'retainer', 'active', 'Veljko Dragšić', '2025-01-01'),
  ('3c2ac2a9-7c11-4de0-ac32-aea3ba11b17e', 'The Shade Store', 'f1aa4a30-381f-4b08-97f4-1c8d7c29afa6', 'fixed', 'active', 'Amber Gapinski', '2025-06-01'),
  ('39c66c48-6b29-43b5-8634-ff06cf7b3211', 'WAGL', 'bd2f8a52-647e-4c43-863b-b26fc97c62b1', 'fixed', 'completed', 'Danijel Latin', '2025-01-01'),
  ('d6ae6781-72d6-49fc-8f9c-ca11e00472d9', 'World Emblem', 'acfdafca-c120-42dd-b69b-991b973f890e', 'fixed', 'active', 'Alex Wood', '2025-01-01'),
  ('e081f428-886c-48b1-9455-cf17f5cca4ec', 'World Emblem - AIDaaS', 'acfdafca-c120-42dd-b69b-991b973f890e', 'retainer', 'active', 'Erica Briones', '2025-06-01'),
  ('c094315e-2d04-4085-96ff-db7fc98809ef', 'Xavier University', '4acb560b-f050-4b6d-9b66-34499690fe2e', 'fixed', 'active', 'Alex Wood', '2025-06-01'),
  ('6b4eb511-2c47-425e-830e-15f06ec42f48', 'ZeroFox', '3ebbcb98-747c-41ee-bdba-23e2637d3c78', 'fixed', 'active', 'Erica Briones', '2025-09-01'),
  ('734463f4-1a46-4f35-8154-6168f07d2c59', 'Sitemark', 'd8eaf80d-6de9-4295-90d8-aeea81fc69d5', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('3130e28d-7041-4d73-a0e0-fc6959d4ec99', 'Certify-Ed - Platform', '3937760f-ca11-499f-a1d2-5318e15bca3d', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('f7b79b01-3e2c-4ed6-a1c4-f6f339249675', 'RPM Raceway', 'd03186a9-aa2b-4f25-93c2-fb3f448b5c4c', 'retainer', 'active', 'Tibor Kranjčec', '2024-01-01'),
  ('ad798e4f-8ef2-41ac-b0f2-dff6f40eda1f', 'Flexcare', 'f0e649af-dee1-4905-a2e7-201ab4cbf044', 'retainer', 'active', 'Danijel Latin', '2024-01-01'),
  ('7920ce76-18d7-468c-a51e-cf14a4df803b', 'GOST', 'd2c729b0-0aba-42ae-8a58-6a9a62fbbcf8', 'hourly', 'active', 'Danijel Latin', '2024-01-01'),
  ('072b58f4-2031-497b-a208-47cb505585f3', 'Carnival', '00412753-fa4f-42ea-b14f-f820743755f4', 'fixed', 'completed', 'Alex Wood', '2025-09-01'),
  ('527a048d-fd6f-48c1-81aa-17a0e5480717', 'Grant Thornton', '1c54f934-4898-48f2-a40d-4ff661098983', 'fixed', 'completed', 'Alex Wood', '2025-06-01'),
  ('1ccf3c69-f2f2-42f0-8051-9f75db815dd7', 'Revelocity', '6dbcdabb-5c87-4943-b276-cc2a42a15a96', 'fixed', 'completed', 'Alex Wood', '2025-09-01'),
  ('bb7c77dc-5c2a-4a84-8e58-c799643e51a6', 'Encoda', 'bad11a72-7140-4825-9fb0-50ebde7aa6b5', 'fixed', 'active', 'Alex Wood', '2025-12-01'),
  ('4b33777f-edfe-428d-80cb-ac70b2b280c7', 'TrackFrame', 'ec6886c9-62bc-49e5-ba80-37b9e1461202', 'fixed', 'active', 'Erica Briones', '2025-09-01'),
  ('b9f26d65-12ef-4495-9194-a3db1ebdfd4e', 'OP: Wave 1', 'da2ee52b-a7e3-4066-9e63-b41976687fd2', 'fixed', 'active', 'Erica Briones', '2025-10-01'),
  ('df69d287-c36e-4943-abbe-f588b4e70b4e', 'OP: Billers + EHR', 'da2ee52b-a7e3-4066-9e63-b41976687fd2', 'fixed', 'active', 'Erica Briones', '2025-12-01'),
  ('47867755-e5b8-4e49-92a0-fb2f33b89d27', 'Bond', '179e5123-0281-434f-b732-e58acf2dcf13', 'fixed', 'active', 'Alex Wood', '2026-01-01');

-- ============================================================
-- INITIAL STATUS UPDATES (from Notion, week of Feb 10 2026)
-- ============================================================

INSERT INTO project_status_updates (project_id, week_of, status, update_note, next_milestone, blockers, updated_by) VALUES
  ('3e66abef-ed67-4afe-add5-ffa2c6a99a6f', '2026-02-09', 'green', 'The client is resolving their overdue invoices, but still one left. We have received a new batch of tasks. The progress is steady and the client is satisfied.', NULL, NULL, 'Danijel Latin'),
  ('29cbb00f-f851-4e8e-920f-860a3764ce40', '2026-02-09', 'green', 'All of the changes have been delivered. The client is gathering student feedback.', NULL, NULL, 'Danijel Latin'),
  ('443e1c60-6603-4c75-a68e-f412762c5589', '2026-02-09', 'green', 'Megan is working on her side to set everything up for the project. We have very little work left to do after she is done.', NULL, NULL, 'Danijel Latin'),
  ('a659cf44-6f25-45f9-80b9-d217d7afaff4', '2026-02-09', 'green', 'Today is a big deploy to production (moved from 15th) and we feel good about it. After that we are moving to the next batch of tasks.', 'Feb 12th, next stage launch to production', NULL, 'Danijel Latin'),
  ('65a94050-84a5-4677-997e-ea0df632ad8f', '2026-02-09', 'green', 'We have sent the last batch of updated documents. Our turnaround is on average two days.', NULL, NULL, 'Danijel Latin'),
  ('8f129917-e941-454d-a603-ca25c5e41151', '2026-02-09', 'green', 'Module 1 complete, working on Module 2. Client approved ~30 hours for a design discovery on the dashboard.', 'Module 2 development', NULL, 'Alex Wood'),
  ('ec48d1b9-0046-40bc-83e1-a9aae926798e', '2026-02-09', 'green', 'We are delivering tasks either on time or ahead of time. Started working with their new developer, relationship is positive.', NULL, NULL, 'Danijel Latin'),
  ('5e3fc1b6-d38e-4d30-bbdc-0f0c19862230', '2026-02-09', 'green', 'Nothing new, going good as usual. Big rebranding/migration is scheduled for February.', NULL, NULL, 'Veljko Dragšić'),
  ('f6dec078-0bb8-4f34-9ae8-11ce0f2c1af4', '2026-02-09', 'green', 'Meeting with Client today with the intent to close out phase 1. Client working on document for VBT for phase 2 SOW.', 'Close out phase 1, Phase 2 SOW', NULL, 'Amber Gapinski'),
  ('00a5760b-15a1-44cb-ad1c-2e138257fbf6', '2026-02-09', 'yellow', 'Working on VO Mock ups. Client looking forward to them so we can take next steps.', 'VO mockups in progress', NULL, 'Amber Gapinski'),
  ('2dc19e0b-c933-4782-bc9c-f3bea310b521', '2026-02-09', 'green', 'We are in support mode. Stephen gave verbal approval for two SoWs that we are preparing now.', NULL, NULL, 'Veljko Dragšić'),
  ('2a759d6e-f18e-46f0-8870-4cdb8e257fbf', '2026-02-09', 'green', 'Working on both individual track items and track integration. Still fighting to get access everywhere we need.', 'Need all access points', NULL, 'Alex Wood'),
  ('e7f86ccb-f6d8-4bbf-a022-7bda590d9e8e', '2026-02-09', 'green', 'No update - have not heard back from Sahil. Only some questions re PowerBI coming from their team.', NULL, NULL, 'Veljko Dragšić'),
  ('3c2ac2a9-7c11-4de0-ac32-aea3ba11b17e', '2026-02-09', 'green', 'Received items for P0 of Rendering. Tentative meeting scheduled on Friday 2/20.', 'Meeting with client on Production workflow 2/20', NULL, 'Amber Gapinski'),
  ('d6ae6781-72d6-49fc-8f9c-ca11e00472d9', '2026-02-09', 'green', 'V1.2 continuing to be launched in waves. Component feedback has been good. Building out V1.5.', 'V1.5 working version EOW', NULL, 'Alex Wood'),
  ('e081f428-886c-48b1-9455-cf17f5cca4ec', '2026-02-09', 'green', 'The initiatives started to generate ROI. Numbers look promising.', 'All teams complete Prompt Engineering Training', 'Short month, need to deliver 77hs. Concerned about capacity with OP demands.', 'Erica Briones'),
  ('c094315e-2d04-4085-96ff-db7fc98809ef', '2026-02-09', 'green', 'Finalizing service integrations and continuing to deploy to TestFlight. Good progress.', 'Chat infrastructure and support in UI', NULL, 'Alex Wood'),
  ('6b4eb511-2c47-425e-830e-15f06ec42f48', '2026-02-09', 'green', 'We presented the discovery report and the client asked for the future work estimates.', 'Send future work estimates', NULL, 'Erica Briones'),
  ('bb7c77dc-5c2a-4a84-8e58-c799643e51a6', '2026-02-09', 'green', 'Client checkpoint meeting for opportunity mapping. Client was really happy with outcome.', 'Deliverables in next two weeks', NULL, 'Alex Wood'),
  ('4b33777f-edfe-428d-80cb-ac70b2b280c7', '2026-02-09', 'green', 'Dev team had a good session. Unblocked important definitions for integration layer.', 'v0.3.0-beta (Feb 28) - Production Ready', 'Access to client environment so we can test our concepts', 'Erica Briones'),
  ('b9f26d65-12ef-4495-9194-a3db1ebdfd4e', '2026-02-09', 'green', 'Team is starting to find its velocity. Reviewing backlog and working on user personas.', 'Complete foundation Backlog and Plan', 'Component library selection', 'Erica Briones'),
  ('df69d287-c36e-4943-abbe-f588b4e70b4e', '2026-02-09', 'green', 'Several meetings with the client this week, discovery is evolving as expected.', NULL, NULL, 'Erica Briones'),
  ('47867755-e5b8-4e49-92a0-fb2f33b89d27', '2026-02-09', 'green', 'SOW signed, working to connect with project team.', NULL, 'Do we know the client team yet?', 'Alex Wood');

-- Verify
SELECT 'Clients: ' || COUNT(*)::text FROM clients
UNION ALL
SELECT 'Projects: ' || COUNT(*)::text FROM projects
UNION ALL
SELECT 'Active projects: ' || COUNT(*)::text FROM projects WHERE status = 'active'
UNION ALL
SELECT 'Status updates: ' || COUNT(*)::text FROM project_status_updates;
