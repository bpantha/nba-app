# NBA-App

NBA-App is a web application developed by Jay Pantha, Cameron Ysidron, Suniul Karim, and Charlie Ross. It provides NBA fans with a platform to explore and analyze basketball statistics for teams, players, and games. The application aims to simplify the overwhelming amount of data available and present it in a clean and polished interface.

## Project Goals

The primary goal of NBA-App is to address the problem faced by NBA fans who struggle to find a centralized hub for viewing relevant and straightforward statistics. The team members, being passionate basketball enthusiasts themselves, were motivated to create a solution that would make it easier for both newcomers and super fans to access and understand NBA statistics. Additionally, the application aims to provide complex and interesting analyses to enhance the statistical insight gained by users.

## Architecture

The NBA-App architecture involves various components and technologies. The data cleaning process is performed using Python and PandasDB scripts on a Google Colab page, resulting in cleaned CSV files for each table. The cleaned data is hosted on AWS RDS, and DataGrip is used for data insertion into the database tables. The backend of the application is implemented using Node.js and Express.js, while the frontend client is built with React and MaterialUI. Components such as NavBar.js, SeasonSelect.js, PlayerCard.js, and TeamCard.js are utilized to facilitate user interactions and data display.

## Data Sources

NBA-App utilizes several data sources to gather basketball statistics:

1. **NBA-nba_all_elo**: This dataset contains game-by-game information, including team Elo ratings, game outcomes, and predictions. It provides insights into team performance and predictions accuracy.

2. **NBA-modern_RAPTOR_by_player**: This database focuses on advanced statistics used to identify the best players in the NBA since 2014. It includes offensive, defensive, and WAR statistics, enabling analysis of player performance.

3. **NBA-historical_RAPTOR_by_player**: Similar to the previous dataset, this contains historical player data before 2014, allowing analysis of player performance in earlier seasons.

4. **Kaggle**: This dataset provides basic NBA player biographic information such as height, weight, draft position, college, and country.

## Database

The NBA-App database consists of five tables: Players, Teams, Seasons, Awards, and Games. These tables store relevant information about players, teams, seasons, awards, and game statistics. Foreign key constraints maintain the relationships between the tables, ensuring data integrity.

## Web App

The NBA-App provides a user-friendly web interface with four main pages: Home, Teams, Players, and Games. The Home page allows users to filter statistics by season using a slider and view active teams or team rosters for a specific season. The Teams page displays information about the most awarded teams and teams without top 20 RAPTOR players in a season. The Players page showcases award winners and top players based on RAPTOR. The Games page allows users to search for games and displays biggest upsets based on ELO forecast.

## API Specification

The NBA-App exposes several API routes to retrieve specific information from the database:

1. `/author/:type`: Returns the author of the app, accepting either "name" or "pennkey" as the type.

2. `/player/:player_id`: Returns detailed information about a specific player based on their player_id.

3. `/game/:game_id`: Returns detailed information about a specific game based on the game_id.

4. `/player_stats/:player_id/:season`: Returns information about a player's performance in a specific season.

5. `/best_players/:season?`: Returns the top players from a given season based on total RAPTOR.

6

. `/upsets`: Returns games with the lowest forecasted chance of winning where the result was a win.

7. `/draft/bad`: Returns players who overperformed their draft position.

These routes allow users to access specific data points and perform custom queries.

## Conclusion

NBA-App is an innovative web application that aims to enhance the NBA fan experience by providing easy access to comprehensive basketball statistics. Through its user-friendly interface, users can explore team performance, player statistics, and game outcomes. By leveraging various datasets and implementing sophisticated analysis, NBA-App empowers fans to gain valuable insights into the world of professional basketball.

## Dependencies <br>
https://github.com/ChrisKatsaras/React-NBA-Logos<br>
$ npm install react-nba-logos<br>

## To Run Locally: <br>
Clone github repo, and run "npm start"
