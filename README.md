# Wellness Fitness Missions

Live Project Link: [https://cudis-missions.vercel.app/](https://cudis-missions.vercel.app/)

## Description

The **Cudis Mission Project** is a wellness-focused application that encourages users to participate in fitness missions, track their daily health activities, and compete with others on leaderboards. The platform integrates data from the Cudis Wellness Ring to provide users with accurate tracking of their physical activities, such as steps walked and hours slept.

## Features

- **Mission Management**: Users can create and join fitness-related missions (e.g., walking, sleep).
- **Progress Tracking**: Users can track their daily progress on active missions by recording steps or sleep hours.
- **Leaderboards**: Participants can compete with others and view rankings based on points scored in missions.
- **Mission Feeds**: Participants can write posts about the mission related and ohter users can can see and react to it incerasing community engagements.
- **Email invites**: Participants can invite their friends to the mission through email notifications.
- **Real-time Data**: Dynamic updates for mission progress and leaderboard standings.

## Website Demo

![Mission Dashboard](https://github.com/akshaydhayal/Cudis-Missions/blob/main/cudis-missions-vercel-app.png)

*Figure 1: Overview of active and completed missions.*


![Mission Details](https://github.com/akshaydhayal/Cudis-Missions/blob/main/cudis-missions-vercel-app-missions-6706afc6f9aaf67317f8c075.png)

*Figure 3: Detailed view of a specific mission with leaderboard and email invitations notifications*


![Mission Details](https://github.com/akshaydhayal/Cudis-Missions/blob/main/cudis-missions-vercel-app-missions-6706afc6f9aaf67317f8c075%20(1).png)
*Figure 2: Missions Feeds Sections*

![Mission Details](https://github.com/akshaydhayal/Cudis-Missions/blob/main/3.png)
*Figure 2:  Mission Create Page.*



## Video Demo:

https://www.loom.com/share/f6838bc608cc47b2bfd22b410d5f4b4d?sid=c0e7a9ad-0a01-4207-825b-5ca72a0d44b2

## Technologies Used

- **Frontend**: Next.js, React, Recoil, Tailwind CSS, Lucide Icons
- **Backend**: Next.js
- **Database**: MongoDB (for storing user and mission data)

## Endpoints

- **Fetch All Missions**: `GET /api/missions`
- **View Specific Mission**: `GET /api/missions/:id`
- **Join a Mission**: `PUT /api/missions/:id`
- **Submit Mission Records**: `POST /api/missions/records/:id`
- **Fetch Leaderboard**: `GET /api/leaderboard`
- **Post a Mission Post**: `POST /api/missions/posts/:id`
- **Send a Email Invitation**: `POST /api/missions/emails`

## MongoDB Collections

- **MissionList**
  - Fields: `title`, `description`, `type`, `pointsPerStep`, `deadline`, `creator`, `participants`,`posts`
- **UserList**
  - Fields: `name`, `email`, `walletAddress`, `pointsScored`, `missionsJoined`, `avatar`

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/cudis-mission-project.git
   cd cudis-mission-project
