const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const baseURL = "https://statejobs.ny.gov/public/vacancyTable.cfm";
const baseJobURL = "https://statejobs.ny.gov/public/vacancyDetailsView.cfm?id=";
const importantLabels = [
  "Agency",
  "Title",
  "Occupational Category",
  "Salary Range",
  "Employment Type",
  "Hours Per Week",
  "From",
  "To",
  "County",
  "Street Address",
  "City",
  "State",
  "Zip Code",
  "Name",
  "Telephone",
  "Email Address",
  "Minimum Qualifications",
  "Duties Description",
  "Notes on Applying",
];
const jobs = [];
const headers = {
  "Access-Control-Allow-Origin": "*", // Allow from any origin
  "Access-Control-Allow-Methods": "GET, OPTIONS", // Allow specific methods
  "Access-Control-Allow-Headers": "Content-Type", // Allow specific headers
};

module.exports = async (req, res, next) => {
  console.log("Initializing browser...");
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(baseURL);

  try {
    console.log("Start scraping...");
    // wait for table to load
    await page.waitForSelector("#vacancyTable");
    // expand page length to X results
    await page.select("select#dt-length-0", "50");
    // sort page by date
    const sortByDate = await page.$(`th[data-dt-column="3"]`);
    await sortByDate.click();
    await sortByDate.click();
    // fill array with id retrieved
    const vacanciesIds = await page.$$eval(
      "#vacancyTable tr > td.dt-type-numeric",
      (rows) => {
        return rows.map((row) => row.textContent.trim()); // trim to remove any extra whitespace
      }
    );
    // loop through every vacancy ID
    for (let id of vacanciesIds.slice(0, 15)) {
      console.log("checking jobs");
      let job = {};
      // go to vacancy id
      await page.goto(baseJobURL + id);
      // wait for the information panel to load
      await page.waitForSelector(".ui-tabs");
      // get all tabs
      const tabs = await page.$$(".ui-tabs-panel");
      // get date
      const dateEl = await page.$(".rightCol");
      const dateText = await dateEl.evaluate((date) => date.textContent.trim());
      // get vacancy ID
      const vacancyEl = await page.$$(".rightCol");
      const vacancyId = await vacancyEl[2].evaluate((id) =>
        id.textContent.trim()
      );
      // loop through tabs
      for (let tab of tabs) {
        console.log("Checking tabs...");
        // get rows
        const rows = await tab.$$(".row");
        // loop through rows
        for (let row of rows) {
          console.log("Checking rows...");
          // get labels and values
          const labelEl = await row.$(".leftCol");
          const labelText = await labelEl.evaluate((label) => {
            for (let node of label.childNodes) {
              if (node.nodeType === Node.TEXT_NODE) {
                return node.nodeValue.trim();
              }
            }
          });
          const valueEl = await row.$(".rightCol");
          let valueText;
          // if field is salary range
          if (labelText === "Salary Range") {
            // return obj with salary props
            valueText = await valueEl.evaluate((value) => {
              return {
                type: value.textContent.split(" ").includes("Hourly")
                  ? "Hourly"
                  : "Yearly",
                low: value.textContent.split(/\D+/g).filter((i) => i !== "")[0],
                high: value.textContent
                  .split(/\D+/g)
                  .filter((i) => i !== "")[1],
              };
            });
          } else {
            // just return text
            valueText = await valueEl.evaluate((value) => {
              return value.textContent.trim();
            });
          }

          // only return selected field
          if (importantLabels.includes(labelText)) {
            job[labelText.split(" ").join("_").toLowerCase()] = valueText;
          }
        }
      }
      // push job obj + retrieved date, vacancy id, url
      jobs.push({
        ...job,
        date: dateText,
        vacancy_id: vacancyId,
        url: baseJobURL + vacancyId,
      });
    }
    console.log("Reached the end");
    // send response
    res.set(headers).json(jobs);
  } catch (err) {
    // pass err to error middleware
    console.log(err);
    next(err);
  } finally {
    // close browser
    if (browser) {
      // just in case
      await browser.close();
    }
  }
};
