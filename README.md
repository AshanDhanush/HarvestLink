# HarvestLink: Agricultural Intelligence Platform

HarvestLink is a distributed, microservices-based system designed to empower the agricultural sector through data-driven insights. The platform combines a robust Java/Spring Boot backend with a Python-powered machine learning engine to provide real-time price predictions and comprehensive management tools.

## 🏗️ System Architecture
This project follows a **Microservices Architecture**, ensuring scalability and fault tolerance:

* **API Gateway:** Centralized entry point using Spring Cloud Gateway.
* **Admin Service:** Manages core administrative logic and platform configurations.
* **Order Service:** Handles transactions and generates monthly revenue analytics.
* **AI Price Prediction Service:** A Python microservice using a **Random Forest Regressor** to predict crop prices based on market data.
* **Notification Service:** Real-time event-driven updates via **Apache Kafka**.
* **Admin Dashboard:** A responsive UI built with **React** and **Tailwind CSS**.

## 🛠️ Tech Stack
- **Backend:** Java (Spring Boot), Python (Scikit-Learn, Pandas)
- **Frontend:** React.js, Tailwind CSS, Framer Motion
- **Messaging:** Apache Kafka (Event-driven communication)
- **Database:** MongoDB Atlas
- **DevOps:** Docker, Docker Compose
