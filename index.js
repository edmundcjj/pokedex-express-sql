const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const { Client } = require('pg');

// set all of the configuration in an object
// const configs = {
//   user: 'postgres',           // Name of the user that is linked to the database
//   host: '127.0.0.1',          // Where the database is hosted
//   database: 'pokemons',         // Name of the database
//   port: 5432,                 // Port number database is connected to
//   password: 'edmund92chow'    // Password to connect to the database
// };
//
// // create a new instance of the client
// const client = new pg.Client(configs);
//
// client.connect((err) => {
//   if (err) console.error('connection error:', err.stack);
// });

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));


// Set handlebars to be the default view engine
app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');


/**
 * ===================================
 * Routes
 * ===================================
 */
// Render page to display all pokemon names available in the database
// GET / should return HTML page showing all pokemons currently in database
// (specifically in the pokemon table within the database)
app.get('/', (req, response) => {
  // Initialise postgres client
  const client = new Client ({
    user: 'postgres',           // Name of the user that is linked to the database
    host: '127.0.0.1',          // Where the database is hosted
    database: 'pokemons',         // Name of the database
    port: 5432,                 // Port number database is connected to
    password: 'edmund92chow'    // Password to connect to the database
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    let context = {
      pokemon: []
    };
    // query database for all pokemon
    const queryString = 'SELECT name FROM pokemon ORDER BY id';

    client.query(queryString, (err, res2) => {
      if (err) {
        console.error('query error => ', err.stack);
      } else {
        context.pokemon = res2.rows;
        console.log(context);

        // respond with HTML page displaying all pokemon
        console.log("Before rendering...");
        response.render('home', context);
        console.log("After rendering...");
      }
      // Close the client connection
      client.end();
    });
  });
});

// Render the create new pokemon form
// GET /new should return HTML page showing a form to create a new pokemon
// - upon submit, it should send POST request to /
app.get('/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('new');
});

// Create new pokemon and update the pokemons database
// POST / should create a new pokemon and insert a new entry in the pokemon table,
// and should redirect to the home page /
app.post('/', (req, response) => {
  // Initialise postgres client
  const client = new Client ({
    user: 'postgres',           // Name of the user that is linked to the database
    host: '127.0.0.1',          // Where the database is hosted
    database: 'pokemons',         // Name of the database
    port: 5432,                 // Port number database is connected to
    password: 'edmund92chow'    // Password to connect to the database
  });

  let pokemon = req.body;

  const queryString = 'INSERT INTO pokemon(id, num, name, img, weight, height) VALUES($1, $2, $3, $4, $5, $6)'
  const values = [pokemon.id, pokemon.num, pokemon.name, pokemon.img, pokemon.weight, pokemon.height];


  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else {
        console.log('query result:', res);

        // redirect to home page
        response.redirect('/');
      }
      // Close the client connection
      client.end();
    });
  });
});

// Get request to display stats of an individual pokemon
// GET /:id (eg. /2) should return HTML page showing information about pokemon
// with primary ID 2 (read: primary ID, not num property)
app.get('/:id', (request, response) => {
  // Initialise postgres client
  const client = new Client ({
    user: 'postgres',           // Name of the user that is linked to the database
    host: '127.0.0.1',          // Where the database is hosted
    database: 'pokemons',         // Name of the database
    port: 5432,                 // Port number database is connected to
    password: 'edmund92chow'    // Password to connect to the database
  });

  let poke_id = request.params.id;

  // query database for pokemon with the specified id mentioned in the url
  const queryString = 'SELECT * FROM pokemon WHERE pokemon.id = ' + poke_id;

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, (err, res2) => {
      if (err) {
        console.error('query error => ', err.stack);
      } else {
        console.log(res2.rows[0]);
        let context = {
          pokemon: {
            id: res2.rows[0].id,
            num: res2.rows[0].num,
            name: res2.rows[0].name,
            img: res2.rows[0].img,
            weight: res2.rows[0].weight,
            height: res2.rows[0].height
          }
        }
        console.log(context);

        // respond with HTML page displaying all pokemon
        console.log("Before rendering...");
        response.render('pokemon', context);
        console.log("After rendering...");
      }
      // Close the client connection
      client.end();
    });
  });
});

// Edit stats of a specific pokemon
// GET /:id/edit (eg. /2/edit) should return HTML page showing a form
// pre-populated with that pokemon's data - upon submit,
// it should send PUT request to /:id
app.get('/:id/edit', (request, response) => {
  // Initialise postgres client
  const client = new Client ({
    user: 'postgres',           // Name of the user that is linked to the database
    host: '127.0.0.1',          // Where the database is hosted
    database: 'pokemons',         // Name of the database
    port: 5432,                 // Port number database is connected to
    password: 'edmund92chow'    // Password to connect to the database
  });

  let poke_id = request.params.id;

  // query database for pokemon with the specified id mentioned in the url
  const queryString = 'SELECT * FROM pokemon WHERE pokemon.id = ' + poke_id;

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, (err, res2) => {
      if (err) {
        console.error('query error => ', err.stack);
      } else {
        console.log(res2.rows[0]);
        let context = {
          pokemon: {
            id: res2.rows[0].id,
            num: res2.rows[0].num,
            name: res2.rows[0].name,
            img: res2.rows[0].img,
            weight: res2.rows[0].weight,
            height: res2.rows[0].height
          }
        }
        console.log(context);

        // respond with HTML page displaying all pokemon
        console.log("Before rendering...");
        response.render('edit', context);
        console.log("After rendering...");
      }
      // Close the client connection
      client.end();
    });
  });
});

// Edit pokemon stats and update the database
// PUT /:id should update the data of the pokemon with the specified ID,
// and should redirect to the pokemon detail page /:id
app.put('/:id', (request, response) => {
  // Initialise postgres client
  const client = new Client ({
    user: 'postgres',           // Name of the user that is linked to the database
    host: '127.0.0.1',          // Where the database is hosted
    database: 'pokemons',         // Name of the database
    port: 5432,                 // Port number database is connected to
    password: 'edmund92chow'    // Password to connect to the database
  });

  let poke_id = request.params.id;

  // query database for pokemon with the specified id mentioned in the url
  const queryString = 'UPDATE pokemon SET name=$1, img=$2, height=$3, weight=$4 WHERE pokemon.id = $5';
  const values = [request.body.name, request.body.img, request.body.height, request.body.weight, parseInt(poke_id)];

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res2) => {
      if (err) {
        console.error('query error => ', err.stack);
      } else {
        console.log(res2);

        console.log("Before rendering...");
        response.redirect('/' + poke_id);
        console.log("After rendering...");
      }
      // Close the client connection
      client.end();
    });
  });
});

// Delete the specified pokemon
// DELETE /:id should delete the entry of the pokemon with the specified ID,
// and should redirect to the home page /
app.delete('/:id', (request, response) => {
  // Initialise postgres client
  const client = new Client ({
    user: 'postgres',           // Name of the user that is linked to the database
    host: '127.0.0.1',          // Where the database is hosted
    database: 'pokemons',         // Name of the database
    port: 5432,                 // Port number database is connected to
    password: 'edmund92chow'    // Password to connect to the database
  });

  let poke_id = request.params.id;

  // query database for pokemon with the specified id mentioned in the url
  const queryString = 'DELETE FROM pokemon WHERE pokemon.id = $1';
  const values = [poke_id];

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res2) => {
      if (err) {
        console.error('query error => ', err.stack);
      } else {
        console.log(res2);

        console.log("Before rendering...");
        response.redirect('/');
        console.log("After rendering...");
      }
      // Close the client connection
      client.end();
    });
  });
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
