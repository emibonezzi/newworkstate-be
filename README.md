# New York State Jobs Scraper

This project is a serverless application built with Express.js and deployed on AWS Lambda. It scrapes job listings from the New York State jobs website and serves them through a REST API.

## Project Structure

- `index.js`: Main server file that sets up the Express app and error handling.
- `serverless.yml`: Configuration file for the Serverless Framework, specifying the AWS Lambda functions and their settings.
- `routes/index.js`: Main router file that collects and sets up all the routes.
- `routes/jobs.js`: Router file for the `/jobs` endpoint.
- `handlers/scrapeJobs.js`: Handler function that performs web scraping using Puppeteer and returns job data.
- `package.json`: Lists project dependencies and scripts.

## Getting Started

### Prerequisites

- Node.js (18.x or higher)
- Serverless Framework CLI
- AWS CLI (configured with your AWS credentials)

### Installing

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/newworkstate-be.git
   cd newworkstate-be
   ```
