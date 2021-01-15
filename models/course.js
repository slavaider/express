const uuid = require('uuid');
const fs = require('fs')
const path = require('path');

class Course {
    constructor(title, price, image) {
        this.title = title
        this.price = price
        this.image = image
        this.id = uuid.v4()
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            image: this.image,
            id: this.id
        }
    }

    static async update(course, id) {
        const courses = await Course.getAll()
        const idx = courses.findIndex(c => c.id === id)
        courses[idx] = {...course, id}
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses), (err) => {
                if (err) reject(err)
                resolve()
            })
        })
    }

    async save() {
        const courses = await Course.getAll()
        courses.push(this.toJSON())
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses), (err) => {
                if (err) reject(err)
                resolve()
            })
        })
    }


    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', 'courses.json'), 'utf-8', (err, data) => {
                if (err) reject(err)
                resolve(JSON.parse(data))
            })
        })
    }

    static async getById(id) {
        const courses = await Course.getAll()
        return courses.find(item => item.id === id)
    }
}

module.exports = Course;
