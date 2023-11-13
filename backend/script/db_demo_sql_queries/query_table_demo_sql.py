INSERT INTO coworking__query (name, start_date, end_date, compare_start_date, compare_end_date)
VALUES ('Query 1', '2023-11-12 00:00:00', '2023-11-24 23:59:59', null, null);

INSERT INTO coworking__query (name, start_date, end_date, compare_start_date, compare_end_date)
VALUES ('Query 2', '2023-11-23 00:00:00', '2023-11-30 23:59:59', '2023-11-15 00:00:00', '2023-11-22 23:59:59');
SELECT * FROM "coworking__query" LIMIT 1000;