CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('paul', 'none', 'part13 start', 0);
insert into blogs (author, url, title, likes) values ('paul', 'none', 'RDBMS course studying', 1);
