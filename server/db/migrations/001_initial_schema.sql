CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE resource_nodes (
    id SERIAL PRIMARY KEY,
    node_type TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add a spatial index to optimize geospatial queries
CREATE INDEX idx_location ON resource_nodes USING GIST(location);
