# Changelog

## Version 1.2.*

### Other changes

Makes now proper use of the Stream Adapter, this means you can use all the supported stream libraries of Cycle.js!

Every storage driver has now a function for getting the nth key.

## Version 1.1.*

### Breaking changes

The function select() was renamed to getItem() to closer ressemble the normal javascript function.

### Other changes

The library exports two additional functions now, that allow for seperated use of the localStorage and the sessionStorage
