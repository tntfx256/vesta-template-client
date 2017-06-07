export class NotificationService {

    static instance: NotificationService;

    constructor() {
        NotificationService.instance = this;
    }


    public static getInstance(): NotificationService {
        if (!NotificationService.instance) NotificationService.instance = new NotificationService();
        return NotificationService.instance;
    }
}