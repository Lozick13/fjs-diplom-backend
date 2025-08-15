#!/bin/bash

echo ******************************************************
echo Starting the replica set
echo ******************************************************

sleep 20 | echo Sleeping

mongosh --host mongo-rs0-1:27017 <<EOF
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'mongo-rs0-1:27017' }]
});

sleep(1000);

rs.conf();

db = db.getSiblingDB('test');
db.hotels.insertMany([
  {
    _id: ObjectId('687f72932605c427d34dd8d7'),
    title: 'Отель 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date('2025-07-22T11:14:27.719Z'),
    updatedAt: new Date('2025-07-30T14:09:27.998Z'),
    __v: 0,
  },
  {
    _id: ObjectId('687f72932605c427d34dd8d8'),
    title: 'Отель 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date('2025-06-15T09:10:00.000Z'),
    updatedAt: new Date('2025-07-28T16:20:00.000Z'),
    __v: 0,
  },
  {
    _id: ObjectId('687f72932605c427d34dd8d9'),
    title: 'Отель 3',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date('2025-05-10T14:30:00.000Z'),
    updatedAt: new Date('2025-07-25T11:45:00.000Z'),
    __v: 0,
  },
]);

db.hotelrooms.insertMany([
  {
    _id: ObjectId('688f4c48d199dd13de307cf5'),
    hotel: '687f72932605c427d34dd8d7',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: ['1.jpeg', '2.jpeg'],
    isEnabled: true,
    createdAt: new Date('2025-08-03T11:47:20.232Z'),
    updatedAt: new Date('2025-08-03T11:47:20.232Z'),
    __v: 0,
  },
  {
    _id: ObjectId('688f4c48d199dd13de307cf6'),
    hotel: '687f72932605c427d34dd8d7',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: ['2.jpeg', '3.jpeg'],
    isEnabled: true,
    createdAt: new Date('2025-08-01T10:30:00.000Z'),
    updatedAt: new Date('2025-08-05T09:15:00.000Z'),
    __v: 0,
  },
  {
    _id: ObjectId('688f4c48d199dd13de307cf7'),
    hotel: '687f72932605c427d34dd8d8',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: ['3.jpeg', '1.jpeg'],
    isEnabled: true,
    createdAt: new Date('2025-07-20T08:00:00.000Z'),
    updatedAt: new Date('2025-08-02T14:20:00.000Z'),
    __v: 0,
  },
  {
    _id: ObjectId('688f4c48d199dd13de307cf8'),
    hotel: '687f72932605c427d34dd8d8',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: ['1.jpeg', '2.jpeg'],
    isEnabled: true,
    createdAt: new Date('2025-07-18T12:00:00.000Z'),
    updatedAt: new Date('2025-08-01T16:30:00.000Z'),
    __v: 0,
  },
  {
    _id: ObjectId('688f4c48d199dd13de307cf9'),
    hotel: '687f72932605c427d34dd8d9',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: ['2.jpeg', '3.jpeg'],
    isEnabled: true,
    createdAt: new Date('2025-07-15T09:00:00.000Z'),
    updatedAt: new Date('2025-07-30T11:00:00.000Z'),
    __v: 0,
  },
  {
    _id: ObjectId('688f4c48d199dd13de307cfa'),
    hotel: '687f72932605c427d34dd8d9',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: ['3.jpeg', '1.jpeg'],
    isEnabled: true,
    createdAt: new Date('2025-07-10T10:00:00.000Z'),
    updatedAt: new Date('2025-07-28T15:00:00.000Z'),
    __v: 0,
  },
]);

db.users.insertMany([
  {
    _id: ObjectId('684a6cecffdcdfa3e71b57d8'),
    email: 'admintest@mail.ru',
    passwordHash:
      '\$2b\$10\$3gNBuFxNgcReyR83jzdgPuUQbPchg4PZD.7QaS/ND.K6K0N/fkVx6',
    name: 'Shrek',
    contactPhone: '+79990001122',
    role: 'admin',
    __v: 0,
  },
  {
    _id: ObjectId('684a6cecffdcdfa3e71b57d9'),
    email: 'managertest@mail.ru',
    passwordHash:
      '\$2b\$10\$3gNBuFxNgcReyR83jzdgPuUQbPchg4PZD.7QaS/ND.K6K0N/fkVx6',
    name: 'Fiona',
    contactPhone: '+79990001133',
    role: 'manager',
    __v: 0,
  },
  {
    _id: ObjectId('684a6cecffdcdfa3e71b57da'),
    email: 'clienttest@mail.ru',
    passwordHash:
      '\$2b\$10\$3gNBuFxNgcReyR83jzdgPuUQbPchg4PZD.7QaS/ND.K6K0N/fkVx6',
    name: 'Donkey',
    contactPhone: '+79990001144',
    role: 'client',
    __v: 0,
  },
]);

db.hotels.createIndex({ title: 1 });
db.hotelrooms.createIndex({ hotel: 1 });
db.users.createIndex({ email: 1 }, { unique: true });

print('Test data initialized successfully!');
EOF