'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Books extends Sequelize.Model {}
    Books.init({
        title:{
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notEmpty:{
                    msg: "TITLE is required"
                }
            }
        } ,
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notEmpty:{
                    msg: "AUTHOR  is required"
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER

    }, { sequelize });

    return Books;
};