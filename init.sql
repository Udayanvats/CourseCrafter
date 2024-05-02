CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE COURSE (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId VarChar(255) NOT NULL,
    title VarChar(255) NOT NULL,
    docs TEXT[] NOT NULL,
    pyqs TEXT[] ,
    "isProcessed" BOOLEAN DEFAULT False,
    mode INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);