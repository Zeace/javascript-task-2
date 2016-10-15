'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (!validPhoneAndName(phone, name)) {
        return false;
    }
    if (!checkExistPhone(phone)) {
        if (email === undefined) {
            email = '';
        }
        phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

        return true;
    }

    return false;
};

function validPhoneAndName(phone, name) {
    if (typeof(name) !== 'string' || phone.length !== 10 || /[^[0-9]/.test(phone)) {
        return false;
    }
    if (typeof(name) !== 'string' || name.length === 0) {
        return false;
    }

    return true;
}

function checkExistPhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i].phone;
        if (note === phone) {
            return i;
        }
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (!validPhoneAndName(phone, name)) {

        return false;
    }
    if (checkExistPhone(phone)) {
        phoneBook[checkExistPhone(phone)].phone = phone;
        phoneBook[checkExistPhone(phone)].name = name;
        if (email === undefined) {
            email = '';
        }
        phoneBook[checkExistPhone(phone)].email = email;
    } else {

        return false;
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    if (query === undefined || query === '') {

        return false;
    }
    var count = 0;
    var indexSearchRes = findSome(query);
    for (var i = indexSearchRes.length - 1; i > -1; i--) {
        phoneBook.splice(indexSearchRes[i], 1);
        count ++;
    }

    return count;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var output = '[\n';
    if (query === '*') {
        var sortPhoneBook = phoneBook.sort(sortObj);
        sortPhoneBook.forEach( function(item) {
            output += outResult(item);
        });
        output = output.substring(0, output.length - 2) + '\n]';

        return output;
    }
    if (query === undefined || query === '') {

        return false;
    } else {
        var indexSearchRes = findSome(query);
        var searchRes = [];
        for (var i = 0; i < indexSearchRes.length; i++) {
            searchRes.push(phoneBook[indexSearchRes[i]]);
        }
        var sortSearchRes = searchRes.sort(sortObj);
        sortSearchRes.forEach( function(item) {
            output += outResult(item);
        });
        output = output.substring(0, output.length - 2) + '\n]';

        return output;
    }

    return false;
};

function outResult(item) {
    var output = '';
    output += '\t\'' + item.name + ', ';
    output += '+7 (' + item.phone.slice(0, 3) + ') ';
    output += item.phone.slice(3, 6) + '-' + item.phone.slice(6, 8);
    output += '-' + item.phone.slice(8, 10);
    if (item.email !== '') {
        output += ', ' + item.email;
    }
    output += '\',\n';

    return output;
}


function findSome(word) {
    var noteNumbers = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var check1 = phoneBook[i].phone.indexOf(word);
        var check2 = phoneBook[i].name.indexOf(word);
        var check3 = phoneBook[i].email.indexOf(word);
        if (check1 !== -1 || check2 !== -1 || check3 !== -1) {
            noteNumbers.push(i);
        }
    }

    return noteNumbers;
}

function sortObj(objA, objB) {
    if (objA.name > objB.name) {
        return 1;
    }
    if (objA.name < objB.name) {
        return -1;
    }
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var newNote = csv.split('\n');
    var countImport = 0;
    var notes = [];
    for (var i = 0; i < newNote.length; i++) {
        notes = newNote[i].split(';');
        if (!exports.update(notes[1], notes[0], notes[2])) {
            if (exports.add(notes[1], notes[0], notes[2])) {
                countImport++;
            }
        } else {
            countImport++;
        }
    }

    return countImport;
};
