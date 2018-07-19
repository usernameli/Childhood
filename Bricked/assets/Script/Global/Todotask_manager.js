/**
 * todotask处理单例
 * @type {{_taskList: {}, init: SML.TodoTaskManager.init, pushTask: SML.TodoTaskManager.pushTask, pushTasks: SML.TodoTaskManager.pushTasks, exec: SML.TodoTaskManager.exec}}
 *
 * // 执行一个 todotask = {action : '', params:{}}
 * SML.TodoTaskManager.pushTask(todotask);
 *
 * // 执行一组 todotasks = [{action : '', params:{}}]
 * SML.TodoTaskManager.pushTasks(todotasks);
 */

SML.TodoTaskState = {
    WAITING : 0,
    DOING : 1,
    FINISHED : 2
};

SML.TodoTaskManager = {
    _taskList: {},
    _taskQueue: [],  // 按队列顺序执行的todotask， 只要上一个回调成功了，才执行下一个。 {action,'', params:{}, state:SML.TodoTaskState}
    init:function() {
        for (var key in SML.TodoTasks) {
            var action = SML.TodoTasks[key].action;
            this._taskList[action] = SML.TodoTasks[key];
        }
    },
    /**
     * 加入立即执行的todotask
     * @param task
     */
    pushTask:function(task) {
        var action = task['action'];
        var taskCase = this._taskList[action];
        this.exec(taskCase, task['params'], task.cb);
    },
    /**
     * 加入立即执行的todotasks
     * @param task
     */
    pushTasks:function(tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            if (task['action'] == 'pop_order') { // 暂时过滤掉
                continue;
            }
            this.pushTask(task);
        }
    },
    /**
     * 执行的todotask
     */
    exec:function(taskCase, params, cb) {
        if (taskCase) {
            taskCase.exec(params, cb);
        }
    },

    /**
     * todotask入队列, 以队列的顺序执行todotask，每个tadotask完成必须执行回调。
     * @param task
     */
    pushToQueue:function(task) {
        var action = task['action'];
        var taskCase = this._taskList[action];
        if (taskCase) {
            task.cb = function(){
                this.finishHeadTask();
            }.bind(this);
            task.state = SML.TodoTaskState.WAITING;
            this._taskQueue.push(task);

            this.checkTaskQueue();
        }
    },

    /**
     * 检查队列，执行队列最前的todotask
     * @private
     */
    checkTaskQueue:function() {
        if (this._taskQueue.length > 0) {
            var headTask = this._taskQueue[0];
            if (headTask.state == SML.TodoTaskState.WAITING) {
                headTask.state = SML.TodoTaskState.DOING;
                this.pushTask(headTask);
            } else if (headTask.state == SML.TodoTaskState.FINISHED) {
                this._taskQueue.shift();
                this.checkTaskQueue();
            }
        }
    },

    /**
     * 完成一个队列中的todotask，需要调用此方法
     */
    finishHeadTask:function() {
        if (this._taskQueue.length > 0) {
            var headTask = this._taskQueue[0];
            headTask.state = SML.TodoTaskState.FINISHED;
            this.checkTaskQueue();
        }
    },

    /**
     * 清空队列
     */
    cleanupQueue : function() {
        this._taskQueue = [];
    }
};


SML.CashTodoTasks = [];