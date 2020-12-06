const express = require('express');


const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/',function(req,res){
  res.json({
      message: 'Hello World'
  });
})




const PORT = 3001;
app.listen(PORT, function () {
  console.log(`API running on port ${PORT}`);
})