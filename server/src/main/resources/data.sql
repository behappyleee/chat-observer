INSERT INTO authority (id, name, description, created_at, updated_at) VALUES
                                                                          ('04e8d2b4-425c-11f0-9016-9120ec417fb8', 'ROLE_AGENT', '상담사 권한', '2025-06-06 07:25:43.475372', '2025-06-08 15:39:38.865439'),
                                                                          ('04e996d6-425c-11f0-9016-9120ec417fb8', 'ROLE_OBSERVER', '옵저버 권한', '2025-06-06 07:25:43.475372', '2025-06-08 15:39:38.859637'),
                                                                          ('f3d0a8c1-25b4-4af0-925e-9df493d84e2f', 'ROLE_CUSTOMER', '고객 사용자 권한', '2025-06-06 07:25:43.475372', '2025-06-08 15:39:38.863462');

-- INSERT 사용자 데이터
INSERT INTO member (id, email, password, status, created_at, updated_at) VALUES
                                                                             ('b3d0cb77-7cd3-4b28-bb7f-a2018a8125e2', 'agent@agent.com', '$2a$10$uTmALp34s9dnFX8OmNufr.9AgfwR5OHtofLmlywmK/M7yNfC/Snze', 0, '2025-06-06 07:25:43.475372', '2025-06-08 16:43:35.611050'),
                                                                             ('c7d8e34b-347a-4b91-b0f6-4e4ea1b6d1cf', 'observer@observer.com', '$2a$10$IAK1eow8NoQT5e06vW.Ivuw9tEgmH.XgtzLak4lR1ZhSR4nzP3xKS', 0, '2025-06-06 07:25:43.475372', '2025-06-08 16:43:11.079852');

-- INSERT 권한 연결
INSERT INTO member_authority (member_id, authority_id, created_at) VALUES
                                                                       ('b3d0cb77-7cd3-4b28-bb7f-a2018a8125e2', '04e8d2b4-425c-11f0-9016-9120ec417fb8', '2025-06-08 16:24:56.292385'),
                                                                       ('c7d8e34b-347a-4b91-b0f6-4e4ea1b6d1cf', '04e996d6-425c-11f0-9016-9120ec417fb8', '2025-06-08 16:25:21.382414');