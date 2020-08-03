
var url = '/dashboard_data';

var stats = fetch(url, {
    method: 'GET',
}).then(response => {
    return response.json()
}).then(data => {
    create_dashboard(data)
});

function create_dashboard(data) {
    var modes = ['fractions', 'pf', 'lcm', 'square', 'square5', 'square5reverse'];
    var usernames = Object.keys(data);

    for (var i = 0; i < modes.length; i++) {
        var table = document.createElement('table');
        var class_attribute = document.createAttribute('class');
        class_attribute.value = "black_outline";
        table.setAttributeNode(class_attribute);
        table.innerHTML += `
        <thead>
            <tr>
                <th colspan="2"; class="black_outline-0pky">${modes[i]}</th>
            </tr>
        </thead>
        <tbody>`

        var username_to_score = [];
        for (var j = 0; j < usernames.length; j++) {
            username_to_score.push([usernames[j], data[usernames[j]][modes[i]]]);
        }
        username_to_score.sort((a, b) => b[1] - a[1]);
        for (var j = 0; j < username_to_score.length; j++) {
            table.innerHTML += `
            <tr>
                <td class="black_outline-0pky">${username_to_score[j][0]}</td>
                <td class="black_outline-0pky">${username_to_score[j][1]}</td>
            <tr>
            `
        }
        table.innerHTML += `</tbody>`;
        document.body.appendChild(table);
    }
}

