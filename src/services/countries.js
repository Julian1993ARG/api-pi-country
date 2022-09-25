const { Op, Country, Activity } = require("../db.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

class CountriesService {
  constructor() {}

  async savedAllCountries() {
    //Si al intentar buscar un pais no lo encuentra, traera toda la data de la API
    const search = await Country.findByPk("246");
    if (search === null) {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const dataNeed = await data.map((element) => {
          const obj = {
            id: element.ccn3 || element.cca3,
            name: element.name.common,
            flag_img: element.flags.png,
            continent: element.continents[0],
            capital: element.capital ? element.capital[0] : "sin capital",
            subregion: element.subregion ? element.subregion : "sin subregion",
            area: element.area,
            population: element.population,
          };
          return obj;
        });
        dataNeed.forEach((i) => {
          Country.findOrCreate({
            where: {
              id: i.id,
              name: i.name,
              flag_img: i.flag_img,
              continent: i.continent,
              capital: i.capital,
              subregion: i.subregion,
              area: i.area,
              population: i.population,
            },
          });
        });
      } catch (error) {
        console.error(
          "🤬 ~ file: countries.js ~ line 46 ~ CountriesService ~ savedAllCountries ~ error",
          error
        );
      }
    }
  }

  async findByName(name) {
    const upercase = this.mayusFirstLetter(name);
    const search = await Country.findAll({
      where: {
        name: {
          [Op.or]: [
            { [Op.iLike]: `${upercase}` },
            { [Op.startsWith]: `${upercase}` },
          ],
        },
      },
      include: Activity,
    });
    if (!search.length) throw Error("Not found");
    else return search;
  }

  async findOne(id) {
    const country = await Country.findOne({
      where: { id: id },
      include: Activity,
    });
    if(!country) throw Error("Not found");
    else return country
  }

  async findByCode(code) {
    const search = await Country.findByPk(code);
    if (!search.length) throw Error("Not found");
    else return search;
  }
  async getActivities(){
    try {
      return Activity.findAll()
    } catch (error) {
      return error
    }
  }
  async addActivity(data) {
    const { name, dificulty, duration, season, idCountry } = data;
    try {
      const newActivity = await Activity.create({
        name,
        dificulty,
        duration,
        season,
      });
      newActivity.addCountry(idCountry);
      return newActivity;
    } catch (error) {
      return error;
    }
  }

  async relation(idCountry, idActivity) {
    const country = await Country.findByPk(idCountry);
    //console.log(country.__proto__);
    country.addActivity(idActivity);
  }

  async deleted(id) {
    try {
      const trash = await Activity.destroy({ where: { id } });
      // console.log("🚀 ~ file: countries.js ~ line 111 ~ CountriesService ~ deleted ~ trash", trash)
      return trash;
    } catch (error) {
      return error;
    }
  }

  /*******************UTILITIES******************* */
  mayusFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

module.exports = CountriesService;
