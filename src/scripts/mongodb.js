//docker ps
//docker exec -it 9d1c4cce86c9  mongo -u ilso -p 1234 --authenticationDatabase herois
//docker run --name postgres -e POSTGRES_USER=ilso -e POSTGRES_PASSWORD=minhasenhasecreta -e POSTGRES_DB=heroes
//docker exec -it 1f4fe8d61a14 postgres -u ilso -p minhasenhasecreta --authenticationDatabase herois


//databases
show dbs

// mudando o contexto para uma database
use herois

//mostrar tables(coleções de documentos)
show collections

db.herois.find().pretty()

for(let i=0; i<=10000; i ++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'velocidade',
        dataNascimento: '1998-01-01'
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1})
db.herois.find({}, {poder: 1, _id: 0})

//create
    db.herois.insert({
        nome: 'Flash',
        poder: 'velocidade',
        dataNascimento: '1998-01-01'
    })

// read
db.herois.find()

//update
db.herois.update({_id: ObjectId("62a22951959867d6016453b7") },
                    {nome: 'Mulher Maravilha'})

db.herois.update({_id: ObjectId("62a22a58959867d60164a195") },
                        { $set: { nome: 'Lanterna Verde'}})


db.herois.update({poder: 'velocidade' },
{ $set: { poder: 'super força'}})

//delete
db.herois.remove({}) //remove todos objetyos da base
db.herois.remove({nome: 'Mulher Maravilha'})