export function uniqueGeoData(data) {
    const seenValues = new Set()
    const newLocationOptions = []

    data.forEach(locationObj => {
        const {name, state, country} = locationObj
        const label = joinCityStateCountry(name, state, country)
        if (seenValues.has(label)) {
            return
        }
        seenValues.add(label)
        newLocationOptions.push({value: label, data: locationObj})
    })

    return newLocationOptions
}

export function joinCityStateCountry(city, state, country) {
    return [city, state, country].filter(Boolean).join(', ')
}
