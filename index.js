$(document).ready(function() {

    $("#search-bands").click(function() {
        const response = ['San Francisco, CA', 'New York City, NY', 'Boston, MA']

        $('#search-results').text("Bands: " + response[0])
    })

})
