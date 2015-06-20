CREATE INDEX article_gin
  ON article
  USING gin
  (title COLLATE pg_catalog."default" gin_trgm_ops);