import server from './server';

const PORT = process.env.PORT || 3000;

server.listen(process.env.PORT, () => {
    console.log(`server listening on port ${PORT}`);
});