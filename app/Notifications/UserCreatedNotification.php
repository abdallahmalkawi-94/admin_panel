<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $password,
        public string $loginUrl
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome! Your Account Has Been Created')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('An account has been created for you. Below are your login credentials:')
            ->line('**Email:** ' . $notifiable->email)
            ->line('**Password:** ' . $this->password)
            ->line('**Important:** Before you can log in, you must verify your email address. You will receive a separate email with a verification link. Please click on that link to verify your email address.')
            ->line('Once your email is verified, you can log in using the credentials above.')
            ->line('Please keep this information secure and change your password after your first login.')
            ->line('If you have any questions or need assistance, please contact support.')
            ->line('Thank you!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'user_id' => $notifiable->id,
            'email' => $notifiable->email,
        ];
    }
}
