const { Router } = require("express");
const { Country, Activity } = require("../db.js");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
//importando los servicios
const CountriesService = require("../services/countries");

const service = new CountriesService();
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/countries/", async (req, res) => {
  const { name } = req.query;
  console.log("🚀 ~ file: index.js ~ line 16 ~ router.get ~ name", name)
  if(!name){
    await service.savedAllCountries()
    res.json(await Country.findAll({include:[Activity]}));
  }else{
    try {
      const country = await service.findByName(name);
      res.json(country)
    } catch (error) {
      res.status(404).json({error:error.message})
    }
  }
});
router.get("/countries/:name", async (req, res) => {
  const { name } = req.params;
    try {
      const country = await service.findByName(name);
      res.json(country)
    } catch (error) {
      res.status(404).json({error:error.message})
    }
});

router.get("/countries/id/:idCountry", async (req, res) => {
  const { idCountry } = req.params;
  try {
    const country = await service.findOne(idCountry);
      res.json(country);
  } catch (error) {
    res.status(404).json({error:error.message});
  }
});

router.get("/activities", async (req, res) => {
  try {
    const allActivities = await service.getActivities();
    res.json(allActivities)
  } catch (error) {
    res.status(404).json({err:error})
  }
});

router.post("/activities", async (req, res) => {
  try {
    const addData = await service.addActivity(req.body);
    res.json(addData)
  } catch (error) {
    res.status(404).json({err:error})
  }
});

module.exports = router;
