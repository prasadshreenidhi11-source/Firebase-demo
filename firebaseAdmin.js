import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  projectId: "react-crud-app-bf8cc",
  clientEmail: "firebase-adminsdk-fbsvc@react-crud-app-bf8cc.iam.gserviceaccount.com",
  privateKey:"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCl+kS/LtlAw6Py\njBxmjcQtPkM8od7+Z9sRNVoDYmPnXm0XT2JUdZAv2Mf6nCK6BRIgmkJGodNxuJab\no2eyX7cIw0HeE2wfBMkc/doYRWWx4EaiGx5g9SVOm64u35+ydBKhhf6hQLhD+qjj\nyy19M1GVoYgKvlfcYDk8lDYRGdx1hBhAtgddx6bVd9BpgRgQplacq/SyLwjumjT1\nzR1NQev/iocxpXCYrkrIPcWKYFygnofPLN7QZAU91EIgkXCWmIn3P3nPhTcZQm77\n8y5SJgjTQ790paxKS6rI61SAfw5hl/sU+taxe7GWdOG8xZwy5Uu1vtFXoEr/xtrz\nwZN5h1eJAgMBAAECggEAAKhKY2pRqIlLjDmrRNeSncT47uqwEdh04zz9SUeS6XAd\nBRIv2V83i7Iciczag4AZ7Udqj3+g3uiUZdf7srtOmrWQ/IF5MANoH/DXvQJMyPTb\nu+c0c3RuQPfhK3KkuWylsj5dw2Mq8xjVxiAOB6Pq0qmcH1R8PXVaZK6aKxN1AMq3\npuuwnFz6jViCU+wJFY+438Y3lZ93Yi8d8cs+m/xqU057lw1Mv8AFPajdzrzi+9ys\nl/tkfVA/Hta28zFOpS8lSVs8OtPM8QOXLp1dZU1MnQeyfXkayIJROcjg+219AgQB\nsQQX+iBp9oehY0edPDc54NuVYy4IaO5swi8AdUvL7QKBgQDcacjim+DE4WPTKDZm\n+niYqlBsCjn+7LWlTLQTnrU/qvl8dYr04YMOSRD3PntA4uqrdVTUQYvaGH19jBQv\nQCZzdl1wF0Qf0+B4NgcFYuCTmV2uHIf+Qwe9c6c8mhVNoQfrWqbXu5CZ/alE7tHz\ntVY8kT+wAjStwlPA9+kiTj2YxwKBgQDAxocJX0KLsIfXom4wtZO9mRVMOv91bgbP\n2qVkDDfUwjp+3Zp33LuEqr7fT9wVggUg4a1PChph3lnvXJVd4HGfqM3gPGFxM6tQ\n4dfcejWe4xW9WIP+/9b/aFL53p9s/P2uoZoqs5hw+kVIf8FGUN0pRAYA4VV56VwE\n9FUz3ohdLwKBgHx1RzeeKUdCtelv1XhEioA5+3tmMuVdqBwUucIyZcnzszix7qrk\nA+q3G1tg7pvvBe+XKzVHZb7bAVE5HdSodo3QEmbO3GrUavW2HDTQZlsxyJIeDjRm\niSJTAeXYY5sYCK6+22MJyFcLwt7ns6nXhUBiDAJI3JIZHs3hrsTuRR3VAoGAN20d\nSFGOVZGVDSfTnMeoSdwo5nkUGBRhewO3h/OHXfHWVcGrdwkNFVDuflB8y+ZNSS35\n4X7bJQaEPzEUdSBiKvCi+PUDY0Pi3ueAZBDzN9K83msD0J6Il3jMWrFqjzCSU9J8\n/AgVLW6X2wd4b5oybHn1a+1d4SZ6YaZKlRZHiNsCgYAjJOCrDqbLPhRw3qhm+Eyj\nqwQMXKzt+ehICHIW6pxS+lOAcJp+RdDkuukHAJUmfTb9iXZ6mCGqQ+VJnLew46pl\noqL5l7mD2c/mcu/wMiXpZuAWuLUaVRaidjaAB9hE+BSQslYpQUvOXqwzu6jiJTq6\nqVj4OpYxG6thellFi4Y4AA==\n-----END PRIVATE KEY-----\n",
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export default db;
