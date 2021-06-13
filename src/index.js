const express = require("express");
const marked = require("marked");
const mediumToMarkdown = require("medium-to-markdown");
const app = express();
const port = 8080;
const APP_VERSION = "v0.1.4";

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    <h1>Convert Medium post to markdown</h1>
    <br/><br/>
    <form action="/markdown" method="POST">
      <!--label for="link">Medium Post Link</label-->
      <input style="width:80%;" name="link" type="text" placeholder="Link to medium article"/>
      <br/><small>Example: <a href="https://pradeep-io.medium.com/what-is-neural-search-537853f3d628">https://pradeep-io.medium.com/what-is-neural-search-537853f3d628</a></small>
      <br/><br/><br/>
      <input type="submit" value="Get Markdown" />
    </form>
    <br/><br/><br/><br/>
      Version ${APP_VERSION} <br/>
      Created by <a href="https://pradeep-io.medium.com/">@pradeep-io</a>
    <br/><br/>
  `);
});

app.post("/markdown", (req, res) => {
  const link = req.body["link"];
  // e.g. https://pradeep-io.medium.com/what-is-neural-search-537853f3d628
  mediumToMarkdown.convertFromUrl(link).then(function (markdown) {
    res.send(`
    <style>
      .section-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
        gap: 20px;
        max-width: 90%;
      }
    </style>
    <style>
      textarea {
        width: 100%;
      }
    </style>
    <style>
     .html-section {
        overflow-y: auto;
      }
    </style>
    <div class="section-container">
      <div class="markdown-section">
        <textarea autocorrect="off" autocapitalize="none" spellcheck="false" autofocus>
          ${markdown}
        </textarea>
      </div>
      <div class="html-section">
        ${marked(markdown)}
      </div>
    </div>
    <br/><br/><br/><br/>
      Version ${APP_VERSION} <br/>
      Created by <a href="https://pradeep-io.medium.com/">@pradeep-io</a>
    <br/><br/>
    <!--Auto Resize TextArea-->
    <script>
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
      this.style.height = "auto";
      this.style.height = (this.scrollHeight) + "px";
    }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
    document.querySelector('textarea').addEventListener('input', (event) => {
      document.querySelector('.html-section').innerHTML = marked(document.querySelector('textarea').value);
    });    
    </script>
    `);
  });
});

app.listen(port, () => {
  console.log(`The app ${APP_VERSION} listening at http://localhost:${port}`);
});

