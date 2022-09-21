const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('country', {
    id:{
      type:DataTypes.STRING(3),
      primaryKey:true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag_img:{
      type:DataTypes.STRING,
      allowNull:false
    },
    continent:{
      type:DataTypes.STRING,
      allowNull:false
    },
    capital:{
      type:DataTypes.STRING,
      allowNull:false
    },
    subregion:{
      type:DataTypes.STRING
    },
    area:{
      type:DataTypes.FLOAT
    },
    population:{
      type:DataTypes.INTEGER
    }

  },
  {
    timestamps: false,
    createdAt: false,
  });

  sequelize.define('Activity',{
    // id:{
    //   type:DataTypes.INTEGER,
    //   primaryKey: true,
    // },
    name:{
      type:DataTypes.STRING(50),
      allowNull:false
    },
    dificulty:{
      type:DataTypes.INTEGER,
      validate:{
        min:1,
        max:5
      }
    },
    duration:{
      type:DataTypes.INTEGER
    },
    season:{
      type:DataTypes.ENUM("Verano", "Otoño", "Invierno", "Primavera")
    }
  },
  {
    timestamps: false,
    createdAt: false,
  }
  )
};
