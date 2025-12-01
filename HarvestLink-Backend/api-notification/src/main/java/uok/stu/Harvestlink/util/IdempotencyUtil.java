package uok.stu.Harvestlink.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class IdempotencyUtil {


    public static String generateKey(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating idempotency key", e);
        }
    }


    public static boolean isValidKey(String key) {
        return key != null && key.length() > 20;
    }
}



