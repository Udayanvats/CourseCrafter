CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE course (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    docs TEXT[] NOT NULL,
    pyqs TEXT[],
    "isProcessed" BOOLEAN DEFAULT FALSE,
    mode INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "processingData" JSONB DEFAULT '{}'
);