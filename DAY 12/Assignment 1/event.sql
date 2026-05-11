-- DAY 12 Assignment 1 - eventDb Database
USE master;
GO 
IF DB_ID('EventDb') IS NOT NULL BEGIN ALTER DATABASE EventDb
SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

DROP DATABASE EventDb;
END
GO 

CREATE DATABASE EventDb;
GO


USE EventDb;
GO 

-- 1) userInfo Table
    CREATE TABLE UserInfo (
        EmailId VARCHAR(255) NOT NULL,
        UserName VARCHAR(50) NOT NULL CHECK (
            LEN(UserName) BETWEEN 1 AND 50
        ),
        Role VARCHAR(20) NOT NULL CHECK (Role IN ('Admin', 'Participant')),
        Password VARCHAR(20) NOT NULL CHECK (
            LEN(Password) BETWEEN 6 AND 20
        ),
        CONSTRAINT PK_UserInfo PRIMARY KEY (EmailId)
    );

GO 

-- 2) eventDetails Table
    CREATE TABLE EventDetails (
        EventId INT NOT NULL,
        EventName VARCHAR(50) NOT NULL CHECK (
            LEN(EventName) BETWEEN 1 AND 50
        ),
        EventCategory VARCHAR(50) NOT NULL CHECK (
            LEN(EventCategory) BETWEEN 1 AND 50
        ),
        EventDate DATETIME NOT NULL,
        Description VARCHAR(255) NULL,
        Status VARCHAR(20) NOT NULL CHECK (Status IN ('Active', 'In-Active')),
        CONSTRAINT PK_EventDetails PRIMARY KEY (EventId)
    );

GO 

-- 3) speakersDetails Table
    CREATE TABLE SpeakersDetails (
        SpeakerId INT NOT NULL,
        SpeakerName VARCHAR(50) NOT NULL CHECK (
            LEN(SpeakerName) BETWEEN 1 AND 50
        ),
        CONSTRAINT PK_SpeakersDetails PRIMARY KEY (SpeakerId)
    );
GO 

-- 4) 

 -- userInfo
INSERT INTO UserInfo (EmailId, UserName, Role, Password)
VALUES (
        'admin@event.com',
        'AdminUser',
        'Admin',
        'Admin@123'
    ),
    (
        'alice@example.com',
        'Alice',
        'Participant',
        'Alice123'
    ),
    (
        'bob@example.com',
        'Bob',
        'Participant',
        'Bob@456'
    ),
    (
        'charlie@example.com',
        'Charlie',
        'Participant',
        'Charlie7'
    ),
    (
        'diana@example.com',
        'Diana',
        'Admin',
        'Diana@99'
    );
GO -- EventDetails
INSERT INTO EventDetails (
        EventId,
        EventName,
        EventCategory,
        EventDate,
        Description,
        Status
    )
VALUES (
        1,
        'Tech Summit 2026',
        'Technology',
        '2026-04-15 10:00:00',
        'Annual technology conference.',
        'Active'
    ),
    (
        2,
        'AI Workshop',
        'Workshop',
        '2026-05-20 09:00:00',
        'Hands-on AI and ML workshop.',
        'Active'
    ),
    (
        3,
        'Cloud Expo',
        'Technology',
        '2026-06-10 11:00:00',
        'Exploring cloud computing trends.',
        'In-Active'
    ),
    (
        4,
        'Web Dev Bootcamp',
        'Training',
        '2026-07-05 08:30:00',
        NULL,
        'Active'
    ),
    (
        5,
        'Cybersecurity Seminar',
        'Security',
        '2026-08-22 10:00:00',
        'Latest threats and defense strategies.',
        'Active'
    );
GO -- SpeakersDetails
INSERT INTO SpeakersDetails (SpeakerId, SpeakerName)
VALUES (1, 'Dr. Raj Sharma'),
    (2, 'Ms. Priya Nair'),
    (3, 'Mr. John Doe'),
    (4, 'Ms. Sara Khan'),
    (5, 'Mr. Arjun Mehta');
GO 


SELECT *
FROM UserInfo;
SELECT *
FROM EventDetails;
SELECT *
FROM SpeakersDetails;