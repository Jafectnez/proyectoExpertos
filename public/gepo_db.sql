-- Create a new database called 'gepo_db'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT name
        FROM sys.databases
        WHERE name = N'gepo_db'
)
CREATE DATABASE gepo_db
GO