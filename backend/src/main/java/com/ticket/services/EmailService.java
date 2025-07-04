package com.ticket.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

//    public void sendOtpEmail(String toEmail, String subject, String body) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom("naymahari371@gmail.com");
//        message.setTo(toEmail);
//        message.setSubject(subject);
//        message.setText(body);
//        mailSender.send(message);
//    }
    
    public void sendOtpEmail(String toEmail, String subject, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("naymahari371@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);

            String content = "<div style='background:#f7f7f7;padding:20px;border-radius:10px;font-family:sans-serif;'>"
                    // logo image
                    + "<div style='text-align:center;margin-bottom:20px;'>"
                    + "<img src='https://i.ibb.co/vCP31vdb/Hariom.png' alt='TicketDesk' style='height:120px;'>"
                    + "</div>"

                    + "<h2 style='color:#00bfff;text-align:center;'>Hello from Hariom Nayma👋</h2>"
                    + "<p style='font-size:16px;color:#333;text-align:center;'>We received a password reset request for your account.</p>"
                    + "<p style='font-size:18px;text-align:center;'>Your OTP is: <strong style='color:#00bfff;font-size:24px;'>" + otp + "</strong></p>"

                    // button
                    + "<div style='text-align:center;margin:30px 0;'>"
                    + "<a href='http://localhost:4200/reset-password' "
                    + "style='display:inline-block;padding:12px 24px;background-color:#00bfff;color:#fff;"
                    + "text-decoration:none;border-radius:8px;font-size:16px;'>Reset Password</a>"
                    + "</div>"

                    + "<p style='font-size:14px;color:#555;text-align:center;'>If you didn’t request this, please ignore this email.</p>"
                    + "<hr style='border:none;height:1px;background:#ddd;margin:20px 0;'>"
                    + "<p style='font-size:12px;color:#aaa;text-align:center;'>© 2025 TicketDesk | Powered by Hariom Nayma</p>"
                    + "</div>";

            helper.setText(content, true);

            mailSender.send(message);
            System.out.println("Fancy OTP mail with logo & button sent to " + toEmail);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

