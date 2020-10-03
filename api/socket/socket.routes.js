
module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        console.log('socket connection on');

        socket.on('connect to task', taskId => {
            if (socket.myTask) {
                socket.leave(socket.myTask)
            }
            socket.join(taskId)
            socket.myTask = taskId;
            console.log('connect to board');
        })
        
        socket.on('update task', task => {
            console.log('update task');

            // emits only to sockets in the same task
            io.to(socket.myTask).emit('send updated task', task)
        })
    })
}