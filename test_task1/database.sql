create table person(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
);
create table events(
    event_type VARCHAR(255),
    user_id SERIAL,
    time timestamp without time zone;
);