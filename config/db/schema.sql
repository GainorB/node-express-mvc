DROP DATABASE IF EXISTS mvc_app;
CREATE DATABASE mvc_app;

\c mvc_app;

CREATE TABLE IF NOT EXISTS articles(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

-- INSERT into articles(title, content) VALUES('Article 1', 'This is article 1');
-- INSERT into articles(title, content) VALUES('Article 2', 'This is article 2');
-- INSERT into articles(title, content) VALUES('Article 3', 'This is article 3');
-- INSERT into articles(title, content) VALUES('Article 4', 'This is article 4');