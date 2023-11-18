// stupid.js
module.exports = (message) => {
    // Liste de synonymes de "tg"
    const synTG = ['tg', 'ta gueule', 'ta geule', 'ta guele', 'ta geule', 'ta guele', 'tgl', 'ta gueulle', 'ta geull']
    const synBonjour = ['bjr', 'bonjour', 'bonsoir', 'salut', 'slt', 'yo', 'wesh', 'hey', 'hello', 'hi', 'coucou']
    const synMoche = ['moche', 'laid', 'laide', 'laids', 'laides', 'moches', 'laides']

    // Si le message contient l'un des synonymes
    if (synTG.some(tg => message.content.toLowerCase().includes(tg))) {
        message.reply('Vas péter dans les fleurs');
    }else if (synBonjour.some(bonjour => message.content.toLowerCase().includes(bonjour))) {
        message.reply('Bonjour à toi');
    }else if (message.content.toLowerCase().endsWith('quoi')) {
        message.reply('FEUR');
    }else if (synMoche.some(moche => message.content.toLowerCase().includes(moche))) {
        message.reply('c\'est toi t\'es disgracieux');
    }
};

