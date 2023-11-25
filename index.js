const express = require('express');
const app = express();
const port = 4000;
const expressHbs = require('express-handlebars');
const blogRoute = require('./routes/blogRouter');
const handlebarsHelpers = require('handlebars-helpers')();
const handlebars = expressHbs.create();

app.use(express.static(__dirname + "/html"));
app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers:{
        showDate: (date) => {
            return date.toLocaleDateString ("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        },
        range: (start, end, currentUrl) => {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push({
                    index: i,
                    url: currentUrl
                });
            }
            return result;
        },
        addQueryParam: (url, query, value) => {
            if(url.includes(query)){
                const queryParams = url.split('?')[1].split('&');
                queryParams.forEach((param, index) => {
                    let [name, num] = param.split('=');
                    if(name == query){
                        num = String(value);
                        queryParams[index] = [name, num].join("=");
                    }
                })
                return [url.split('?')[0], queryParams.join('&')].join('?');
            }
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}${query}=${value}`;
        },
        ...handlebarsHelpers,
    }
}))

app.set("view engine", "hbs");

app.use('/blogs', blogRoute);

app.get('/', (req, res) => {
    // console.log("1");
    res.redirect('/blogs');
});

app.get('/createTables', (req, res) => {
    let models = require('./models');
    models.sequelize.sync().then(() => {
        res.send("Tables created!");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));