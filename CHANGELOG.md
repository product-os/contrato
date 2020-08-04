# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v0.0.6 - 2018-08-17

## 0.4.0 - 2020-08-04


<details>
<summary> Update skhema to 5.x [Pagan Gazzard] </summary>

> ### skhema-5.3.2 - 2020-08-04
> 
> * Switch to typed-error [Pagan Gazzard]
> 
> ### skhema-5.3.1 - 2020-08-04
> 
> * Add .versionbot/CHANGELOG.yml for nested changelogs [Pagan Gazzard]
> 
> ### skhema-5.3.0 - 2020-05-05
> 
> * filter: Throw a custom error if the schema is invalid [Juan Cruz Viotti]
> 
> ### skhema-5.2.9 - 2019-12-12
> 
> * Add test to show .filter() not working correctly [StefKors]
> * When combining with baseSchema merge enum with AND operator [StefKors]
> 
> ### skhema-5.2.8 - 2019-11-27
> 
> * Ensure values in "enum" are unique [Juan Cruz Viotti]
> 
> ### skhema-5.2.7 - 2019-11-27
> 
> * filter: Correctly handle "enum" inside "anyOf" [Juan Cruz Viotti]
> 
> ### skhema-5.2.6 - 2019-11-19
> 
> * merge: Be explicit about additionalProperties [Juan Cruz Viotti]
> 
> ### skhema-5.2.5 - 2019-05-09
> 
> * Add a resolver for the const keyword [Lucian]
> 
> ### skhema-5.2.4 - 2019-04-15
> 
> * Configure AJV instances with an LRU cache [Juan Cruz Viotti]
> 
> ### skhema-5.2.3 - 2019-04-15
> 
> * Set addUsedSchema to false in all AJV instances [Juan Cruz Viotti]
> 
> ### skhema-5.2.2 - 2019-03-20
> 
> * Fix bug in scoreMatch when handling arrays [Lucian]
> 
> ### skhema-5.2.1 - 2019-03-19
> 
> * Fix bad require name and .only in tests [Lucian]
> 
> ### skhema-5.2.10 - Invalid date
> 
> * .filter(): Only match if the base schema matches [Lucian Buzzo]
> 
> ### skhema-5.2.0 - 2019-03-19
> 
> * Add ability to provide custom resolvers to merge() [Lucian]
> 
> ### skhema-5.1.1 - 2019-02-08
> 
> * Split up and optimize lodash dependencies [Lucian]
> 
> ### skhema-5.1.0 - 2019-01-08
> 
> * feature: Implement method for restricting a schema by another schema [Lucian Buzzo]
> 
> ### skhema-5.0.0 - Invalid date
> 
> * Remove ability to add custom keywords or formats [Lucian]
> 
> ### skhema-4.0.4 - Invalid date
> 
> * Improve performance of clone operations [Lucian]
> 
> ### skhema-4.0.3 - 2018-12-10
> 
> * Don't bust AJV cache [Lucian]
> 
> ### skhema-4.0.2 - 2018-12-10
> 
> * Add benchmark tests [Giovanni Garufi]
> 
> ### skhema-4.0.1 - 2018-12-04
> 
> * Recurse through nested `anyOf` statements when filtering [Lucian]
> 
> ### skhema-4.0.0 - 2018-12-03
> 
> * Treat undefined additionalProperties as true instead of false [Lucian]
> 
> ### skhema-3.0.1 - Invalid date
> 
> * stryker: Increase test timeout [Juan Cruz Viotti]
> * test: Configure Stryker for mutative testing [Juan Cruz Viotti]
> 
> ### skhema-3.0.0 - 2018-11-29
> 
> * Define additionalProperty inheritance in anyOf [Giovanni Garufi]
> * Formalising filtering logic [Lucian]
> * Added failing test case with mutation [Lucian]
> 
> ### skhema-2.5.2 - 2018-11-07
> 
> * hotfix: Make sure things that should be filtered are filtered [Juan Cruz Viotti]
> 
> ### skhema-2.5.1 - 2018-11-06
> 
> * filter: Force additionalProperties: true on match schemas [Juan Cruz Viotti]
> 
> ### skhema-2.5.0 - 2018-10-16
> 
> * Validate against just the schema if `options.schemaOnly` is true [Lucian Buzzo]
> 
> ### skhema-2.4.1 - 2018-10-09
> 
> * merge: When merging an empty array, return a wildcard schema [Lucian Buzzo]
> 
> ### skhema-2.4.0 - 2018-10-09
> 
> * validate: Make object optional [Lucian Buzzo]
> 
</details>

# v0.3.1
## (2020-08-04)

* Add .versionbot/CHANGELOG.yml for nested changelogs [Pagan Gazzard]

# v0.3.0
## (2020-07-17)

* Add logical operator support in templates [Stevche Radevski]

## 0.2.1 - 2019-08-22

* Fix typings module name and optional params [Cameron Diver]

## 0.2.0 - 2019-08-22

* Add typescript types to project [Cameron Diver]

## 0.1.0 - 2019-08-19

* Add circleci configuration file [Cameron Diver]
* Only perform a version check if child version is valid [Cameron Diver]
* Feature: Add support for 'latest' in selectors [Andreas Fitzek]
* Feature: Add sequence generation for Blueprints [Andreas Fitzek]
* Feature: Add support for skhema filters in blueprint selectors [Andreas Fitzek]

## v0.0.7 - 2018-10-19

* Partials: Return correct path combinations given 3 versioned contracts [Juan Cruz Viotti]
* Test: Add missing test case for find partial [Trong Nghia Nguyen]

- Add aliases support

## v0.0.5 - 2018-04-18

- Add a collection of Handlebars templates to the partial system

## v0.0.4 - 2018-04-09

- Support generating combinations of more than 31 contracts

## v0.0.3 - 2018-03-07

### Changed

- Add versioned contract fallback paths when finding partials

## v0.0.2 - 2017-10-13

### Changed

- Fix package.json entry point
