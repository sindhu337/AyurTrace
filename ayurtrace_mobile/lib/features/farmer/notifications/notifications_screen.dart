import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import '../../../models/notification_model.dart';
import 'package:intl/intl.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          IconButton(
            onPressed: () async {
              await context.read<FarmerService>().markAllNotificationsRead();
              setState(() {});
            },
            icon: const Icon(Icons.done_all),
            tooltip: 'Mark all as read',
          ),
        ],
      ),
      body: FutureBuilder<List<NotificationModel>>(
        future: context.read<FarmerService>().getNotifications(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          final items = snapshot.data ?? [];
          
          if (items.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.notifications_none, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No new notifications.', style: TextStyle(color: Colors.grey)),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            separatorBuilder: (context, index) => const Divider(),
            itemBuilder: (context, index) {
              final item = items[index];
              return ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: item.isRead ? Colors.grey.shade100 : Colors.blue.shade50,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    item.isRead ? Icons.notifications_outlined : Icons.notifications_active,
                    color: item.isRead ? Colors.grey : Colors.blue,
                  ),
                ),
                title: Text(item.title, style: TextStyle(fontWeight: item.isRead ? FontWeight.normal : FontWeight.bold)),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 4),
                    Text(item.message),
                    const SizedBox(height: 8),
                    Text(
                      DateFormat('dd MMM, hh:mm a').format(item.timestamp),
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                  ],
                ),
                onTap: () async {
                  if (!item.isRead) {
                    await context.read<FarmerService>().markNotificationRead(item.id);
                    setState(() {});
                  }
                },
              );
            },
          );
        },
      ),
    );
  }
}
