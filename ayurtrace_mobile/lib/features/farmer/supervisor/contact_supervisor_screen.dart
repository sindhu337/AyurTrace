import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/farmer_service.dart';
import '../../../models/message.dart';
import '../../../core/theme/app_theme.dart';
import 'package:intl/intl.dart';

class ContactSupervisorScreen extends StatefulWidget {
  const ContactSupervisorScreen({super.key});

  @override
  State<ContactSupervisorScreen> createState() => _ContactSupervisorScreenState();
}

class _ContactSupervisorScreenState extends State<ContactSupervisorScreen> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  Map<String, dynamic>? _supervisor;

  @override
  void initState() {
    super.initState();
    _fetchSupervisor();
  }

  Future<void> _fetchSupervisor() async {
    try {
      final data = await context.read<FarmerService>().getSupervisor();
      setState(() => _supervisor = data);
    } catch (e) {
      debugPrint("Fetch Supervisor Error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Contact Supervisor'),
            if (_supervisor != null && _supervisor!.containsKey('name'))
              Text(_supervisor!['name'], style: const TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: FutureBuilder<List<Message>>(
              future: context.read<FarmerService>().getMessages(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
                final messages = snapshot.data ?? [];
                
                if (messages.isEmpty) return _buildEmptyChat();

                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final msg = messages[index];
                    final isMe = msg.senderRole == 'ROLE_FARMER';
                    return _buildMessageBubble(msg, isMe);
                  },
                );
              },
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildEmptyChat() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('No previous communication.', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message msg, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.7),
        decoration: BoxDecoration(
          color: isMe ? AppTheme.primaryColor : Colors.grey.shade200,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isMe ? 16 : 0),
            bottomRight: Radius.circular(isMe ? 0 : 16),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(msg.content, style: TextStyle(color: isMe ? Colors.white : Colors.black87)),
            const SizedBox(height: 4),
            Text(
              DateFormat('hh:mm a').format(msg.timestamp),
              style: TextStyle(color: isMe ? Colors.white70 : Colors.grey, fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageInput() {
    final bool noSupervisor = _supervisor == null || _supervisor!.containsKey('message');

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))]),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _messageController,
              enabled: !noSupervisor,
              decoration: InputDecoration(
                hintText: noSupervisor ? 'Supervisor not assigned' : 'Type your message...',
                border: InputBorder.none,
                filled: false,
              ),
            ),
          ),
          IconButton(
            onPressed: noSupervisor ? null : _sendMessage,
            icon: Icon(Icons.send, color: noSupervisor ? Colors.grey : AppTheme.primaryColor),
          ),
        ],
      ),
    );
  }

  void _sendMessage() async {
    if (_messageController.text.trim().isEmpty || _supervisor == null || !_supervisor!.containsKey('id')) {
      if (_supervisor == null || !_supervisor!.containsKey('id')) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No supervisor assigned to message.')));
      }
      return;
    }
    final content = _messageController.text;
    _messageController.clear();
    
    try {
      await context.read<FarmerService>().sendMessage(_supervisor!['id'].toString(), content);
      if (mounted) setState(() {}); // Refresh list
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }
}
