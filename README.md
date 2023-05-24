# NBA-App

NBA-App is a web application developed by Jay Pantha, Cameron Ysidron, Suniul Karim, and Charlie Ross. It provides NBA fans with a platform to explore and analyze basketball statistics for teams, players, and games. The application aims to simplify the overwhelming amount of data available and present it in a clean and polished interface.

## Project Goals

The primary goal of NBA-App is to address the problem faced by NBA fans who struggle to find a centralized hub for viewing relevant and straightforward statistics. The team members, being passionate basketball enthusiasts themselves, were motivated to create a solution that would make it easier for both newcomers and super fans to access and understand NBA statistics. Additionally, the application aims to provide complex and interesting analyses to enhance the statistical insight gained by users.

## Architecture

The NBA-App architecture involves various components and technologies. The data cleaning process is performed using Python and Pandas scripts on a Google Colab page, resulting in cleaned CSV files for each table. The cleaned data is hosted on AWS RDS, and DataGrip is used for data insertion into the database tables. The backend of the application is implemented using Node.js and Express.js, while the frontend client is built with React and MaterialUI. 

## Data Sources

NBA-App utilizes several data sources to gather basketball statistics:

1. **NBA-nba_all_elo**: This dataset contains game-by-game information, including team Elo ratings, game outcomes, and predictions. It provides insights into team performance and predictions accuracy.

2. **NBA-modern_RAPTOR_by_player**: This database focuses on advanced statistics used to identify the best players in the NBA since 2014. It includes offensive, defensive, and WAR statistics, enabling analysis of player performance.

3. **NBA-historical_RAPTOR_by_player**: Similar to the previous dataset, this contains historical player data before 2014, allowing analysis of player performance in earlier seasons.

4. **Kaggle Datasets**: Dataset obtained from kaggle provides basic NBA player biographic information such as height, weight, draft position, college, and country in addtion to player award data.

## Database

The NBA-App database consists of five tables: Players, Teams, Seasons, Awards, and Games. These tables store relevant information about players, teams, seasons, awards, and game statistics. Foreign key constraints maintain the relationships between the tables, ensuring data integrity.

## Dependencies <br>
https://github.com/ChrisKatsaras/React-NBA-Logos<br>
$ npm install react-nba-logos<br>

## To Run Locally: <br>
Clone github repo, and run "npm start"
