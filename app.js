import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const goals = [];

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HTMX Essentials</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.png" />
        <link rel="stylesheet" href="/main.css" />
        <script src="/htmx.js" defer></script>
      </head>

      <body>
        <main>
          <h1> Manage Goals </h1>
          <section>
            <form 
              id="goal-form" 
              hx-post="/goals" 
              hx-target="#goals" 
              hx-swap="beforeend">

              <div>
                <label htmlFor="goal">Goal</label>
                <input type="text" id="goal" name="goal" />
              </div>
              <button type="submit">Add goal</button>
            </form> 
          </section>

          <section>
            <ul id="goals">
              ${goals.map(goal => `
                <li id="goal-${goal.id}">
                  <span>${goal.text}</span>
                  <button 
                    hx-delete="/goals/${goal.id}" 
                    hx-target="#goal-${goal.id}" 
                    hx-swap="outerHTML">Remove</button>
                </li>
              `).join('')}
            </ul>
          </section>
        </main>
      </body>
    </html>
  `);
});

app.post('/goals', (req, res) => {
  const goalText = req.body.goal.trim();
  if (goalText) {
    const goal = { id: uuidv4(), text: goalText };
    goals.push(goal);

    res.send(`
      <li id="goal-${goal.id}">
        <span>${goal.text}</span>
        <button 
          hx-delete="/goals/${goal.id}" 
          hx-target="#goal-${goal.id}" 
          hx-swap="outerHTML">Remove</button>
      </li>
      <script>
        document.getElementById('goal').value = '';
      </script>
    `);
  } else {
    res.status(400).send("Goal cannot be empty");
  }
});

app.delete('/goals/:id', (req, res) => {
  const goalId = req.params.id;
  const goalIndex = goals.findIndex(goal => goal.id === goalId);
  if (goalIndex !== -1) {
    goals.splice(goalIndex, 1);
    res.send("");
  } else {
    res.status(404).send("Goal not found");
  }
});

app.listen(3000);
