Bifrost.namespace("Bifrost.mapping", {
    mapper: Bifrost.Type.extend(function (typeConverters, maps) {
        "use strict";
        var self = this;

        function copyProperties(mappedProperties, from, to, map) {
            for (var property in from) {
                if (property.indexOf("_") === 0) {
                    continue;
                }
                
                if (!Bifrost.isUndefined(to[property])) {
                    
                    if (Bifrost.isObject(to[property])) {
                        copyProperties(mappedProperties, from[property], to[property]);
                    } else {
                        if (!Bifrost.isNullOrUndefined(map)) {
                            if (map.canMapProperty(property)) {
                                map.mapProperty(property, from, to);

                                if (mappedProperties.indexOf(property) < 0) {
                                    mappedProperties.push(property);
                                }

                                continue;
                            }
                        }

                        var value = ko.unwrap(from[property]);
                        var toValue = ko.unwrap(to[property]);

                        var typeAsString = null;
                        if (!Bifrost.isNullOrUndefined(value) &&
                            !Bifrost.isNullOrUndefined(toValue)) {

                            if (value.constructor !== toValue.constructor) {
                                typeAsString = toValue.constructor.name.toString();
                            }
                        }
                        
                        if (!Bifrost.isNullOrUndefined(to[property]) &&
                            !Bifrost.isNullOrUndefined(to[property]._typeAsString)) {
                            typeAsString = to[property]._typeAsString;
                        }

                        if (!Bifrost.isNullOrUndefined(typeAsString) && !Bifrost.isNullOrUndefined(value)) {
                            value = typeConverters.convertFrom(value.toString(), typeAsString);
                        }

                        if (mappedProperties.indexOf(property) < 0) {
                            mappedProperties.push(property);
                        }

                        if (ko.isObservable(to[property])) {
                            to[property](value);
                        } else {
                            to[property] = value;
                        }
                    }
                }
            }
        }

        function mapSingleInstance(type, data, mappedProperties) {
            if (data) {
                if (!Bifrost.isNullOrUndefined(data._sourceType)) {
                    type = eval(data._sourceType);
                }
            }

            var instance = type.create();

            if (data) {
                var map = null;
                if (maps.hasMapFor(data._type, type)) {
                    map = maps.getMapFor(data._type, type);
                }

                copyProperties(mappedProperties, data, instance, map);
            }
            return instance;
        }

        function mapMultipleInstances(type, data, mappedProperties) {
            var mappedInstances = [];
            for (var i = 0; i < data.length; i++) {
                var singleData = data[i];
                mappedInstances.push(mapSingleInstance(type, singleData, mappedProperties));
            }
            return mappedInstances;
        }

        this.map = function (type, data) {
            var mappedProperties = [];
            if (Bifrost.isArray(data)) {
                return mapMultipleInstances(type, data, mappedProperties);
            } else {
                return mapSingleInstance(type, data, mappedProperties);
            }
        };

        this.mapToInstance = function (targetType, data, target) {
            var mappedProperties = [];

            var map = null;
            if (maps.hasMapFor(data._type, targetType)) {
                map = maps.getMapFor(data._type, targetType);
            }
            copyProperties(mappedProperties, data, target, map);

            return mappedProperties;
        };
    })
});
Bifrost.WellKnownTypesDependencyResolver.types.mapper = Bifrost.mapping.mapper;