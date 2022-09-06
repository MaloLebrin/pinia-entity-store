# Introduction

Pinia entity store started with the use of pinia during a project with a relational database. For each entity sent by the backend, corresponds a store created by Pinia. At the beginning, we had created a folder filled with function utils files allowing to make a crud with the data stored in pinia.
During development, we quickly realized that the functions were repeated in each of the stores instantiated in the application. We therefore decided to create this package so as not to have to write the same functions for creation, suppression, update, etc. for each store, for each project.

We finally created stores with out of the box getters and setters for in-app instantiated stores

## What is It ?

Entity Store is a very lightweight package that looks like an orm without having to learn a complex api from a real orm

## Why ?

You can use entity store, on a project with [Vue 3](https://vuejs.org/) and [Pinia](https://pinia.vuejs.org/introduction.html) as state management !

It allows you to have standardized states with useful keys to manage your data.
A set of basic functions (getters, setters) helps you focus on the real purpose of the application instead of wasting time managing your give in the store

And like Pinia, it's a `fully typed` lightweight package to manage relational entities. No need to create custom complex wrappers to support TypeScript, everything is typed and the API is designed in a way to leverage TS type inference as much as possible. Import the functions, call them, enjoy autocompletion!
