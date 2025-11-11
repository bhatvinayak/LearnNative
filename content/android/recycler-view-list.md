---
title: RecyclerView & Lists
description: Master RecyclerView for displaying efficient, scrollable lists with dynamic data
platform: android
order: 11
---

# RecyclerView & Lists

RecyclerView is the most powerful and flexible view for displaying lists of data in Android. It efficiently recycles views as you scroll, providing smooth performance even with thousands of items.

## Why RecyclerView?

**Problems with ListView (old approach):**
- Inefficient view recycling
- Limited layout flexibility
- Poor performance with large datasets

**RecyclerView advantages:**
- Efficient view recycling
- Supports different layout managers (Linear, Grid, Staggered)
- Built-in animations
- Flexible item decorations
- Better separation of concerns

:::compare-react-native
React Native uses FlatList:
```javascript
import { FlatList, Text, View } from 'react-native';

function MyList({ data }) {
    return (
        <FlatList
            data={data}
            renderItem={({ item }) => (
                <View>
                    <Text>{item.title}</Text>
                </View>
            )}
            keyExtractor={item => item.id.toString()}
        />
    );
}
```
Both RecyclerView and FlatList optimize rendering by recycling views, but RecyclerView requires more setup with adapters.
:::

## Basic RecyclerView Setup

### 1. Add Dependency

```kotlin
// build.gradle (Module: app)
dependencies {
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
}
```

### 2. Add RecyclerView to Layout

```xml
<!-- activity_main.xml -->
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/recyclerView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="8dp"
    app:layoutManager="androidx.recyclerview.widget.LinearLayoutManager" />
```

### 3. Create Item Layout

```xml
<!-- item_user.xml -->
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    app:cardCornerRadius="8dp"
    app:cardElevation="2dp">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:padding="16dp">
        
        <ImageView
            android:id="@+id/avatarImage"
            android:layout_width="56dp"
            android:layout_height="56dp"
            android:scaleType="centerCrop"
            android:src="@drawable/ic_person"
            android:contentDescription="User avatar" />
        
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:layout_marginStart="16dp">
            
            <TextView
                android:id="@+id/nameText"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="John Doe"
                android:textSize="18sp"
                android:textStyle="bold" />
            
            <TextView
                android:id="@+id/emailText"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="john@example.com"
                android:textSize="14sp"
                android:textColor="@android:color/darker_gray"
                android:layout_marginTop="4dp" />
        </LinearLayout>
        
        <ImageButton
            android:id="@+id/moreButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:src="@drawable/ic_more_vert"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:contentDescription="More options" />
    </LinearLayout>
    
</com.google.android.material.card.MaterialCardView>
```

### 4. Create Data Model

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String,
    val avatarUrl: String? = null
)
```

### 5. Create ViewHolder

```kotlin
class UserViewHolder(private val binding: ItemUserBinding) : RecyclerView.ViewHolder(binding.root) {
    
    fun bind(user: User, onItemClick: (User) -> Unit, onMoreClick: (User) -> Unit) {
        binding.nameText.text = user.name
        binding.emailText.text = user.email
        
        // Load avatar (using placeholder for now)
        binding.avatarImage.setImageResource(R.drawable.ic_person)
        
        // Item click
        binding.root.setOnClickListener {
            onItemClick(user)
        }
        
        // More button click
        binding.moreButton.setOnClickListener {
            onMoreClick(user)
        }
    }
}
```

### 6. Create Adapter

```kotlin
class UserAdapter(
    private val onItemClick: (User) -> Unit,
    private val onMoreClick: (User) -> Unit
) : RecyclerView.Adapter<UserViewHolder>() {
    
    private val users = mutableListOf<User>()
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return UserViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(users[position], onItemClick, onMoreClick)
    }
    
    override fun getItemCount(): Int = users.size
    
    fun submitList(newUsers: List<User>) {
        users.clear()
        users.addAll(newUsers)
        notifyDataSetChanged()
    }
    
    fun addUser(user: User) {
        users.add(user)
        notifyItemInserted(users.size - 1)
    }
    
    fun removeUser(position: Int) {
        users.removeAt(position)
        notifyItemRemoved(position)
    }
    
    fun updateUser(position: Int, user: User) {
        users[position] = user
        notifyItemChanged(position)
    }
}
```

### 7. Setup in Activity

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var adapter: UserAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        loadUsers()
    }
    
    private fun setupRecyclerView() {
        adapter = UserAdapter(
            onItemClick = { user ->
                Toast.makeText(this, "Clicked: ${user.name}", Toast.LENGTH_SHORT).show()
                // Navigate to detail screen
                openUserDetail(user)
            },
            onMoreClick = { user ->
                showUserOptions(user)
            }
        )
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = this@MainActivity.adapter
            
            // Add divider
            addItemDecoration(DividerItemDecoration(this@MainActivity, DividerItemDecoration.VERTICAL))
        }
    }
    
    private fun loadUsers() {
        val users = listOf(
            User(1, "Alice Johnson", "alice@example.com"),
            User(2, "Bob Smith", "bob@example.com"),
            User(3, "Charlie Brown", "charlie@example.com"),
            User(4, "Diana Prince", "diana@example.com"),
            User(5, "Eve Adams", "eve@example.com")
        )
        
        adapter.submitList(users)
    }
    
    private fun openUserDetail(user: User) {
        val intent = Intent(this, UserDetailActivity::class.java).apply {
            putExtra("USER_ID", user.id)
        }
        startActivity(intent)
    }
    
    private fun showUserOptions(user: User) {
        MaterialAlertDialogBuilder(this)
            .setTitle(user.name)
            .setItems(arrayOf("Edit", "Delete", "Share")) { _, which ->
                when (which) {
                    0 -> editUser(user)
                    1 -> deleteUser(user)
                    2 -> shareUser(user)
                }
            }
            .show()
    }
    
    private fun editUser(user: User) {
        // Navigate to edit screen
    }
    
    private fun deleteUser(user: User) {
        // Delete user with confirmation
    }
    
    private fun shareUser(user: User) {
        // Share user contact
    }
}
```

## Different Layout Managers

### Linear Layout (Vertical/Horizontal)

```kotlin
// Vertical (default)
binding.recyclerView.layoutManager = LinearLayoutManager(this)

// Horizontal
binding.recyclerView.layoutManager = LinearLayoutManager(
    this,
    LinearLayoutManager.HORIZONTAL,
    false
)

// Reverse layout
binding.recyclerView.layoutManager = LinearLayoutManager(
    this,
    LinearLayoutManager.VERTICAL,
    true  // reverseLayout
)
```

### Grid Layout

```kotlin
// Simple grid with 2 columns
binding.recyclerView.layoutManager = GridLayoutManager(this, 2)

// Grid with 3 columns
binding.recyclerView.layoutManager = GridLayoutManager(this, 3)

// Custom span sizes
val gridLayoutManager = GridLayoutManager(this, 3)
gridLayoutManager.spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
    override fun getSpanSize(position: Int): Int {
        return when (position % 5) {
            0 -> 3  // Header takes full width
            else -> 1  // Items take 1/3 width
        }
    }
}
binding.recyclerView.layoutManager = gridLayoutManager
```

### Staggered Grid Layout

```kotlin
// Pinterest-like layout
binding.recyclerView.layoutManager = StaggeredGridLayoutManager(
    2,  // span count
    StaggeredGridLayoutManager.VERTICAL
)
```

:::compare-react-native
React Native layout options:
```javascript
import { FlatList } from 'react-native';

// Vertical list (default)
<FlatList data={data} renderItem={renderItem} />

// Horizontal list
<FlatList data={data} renderItem={renderItem} horizontal />

// Grid layout
<FlatList
    data={data}
    renderItem={renderItem}
    numColumns={2}
/>

// Or use MasonryFlashList for staggered grid
import { MasonryFlashList } from "@shopify/flash-list";

<MasonryFlashList
    data={data}
    numColumns={2}
    renderItem={renderItem}
/>
```
:::

## ListAdapter with DiffUtil

Efficient list updates using DiffUtil:

```kotlin
class UserDiffCallback : DiffUtil.ItemCallback<User>() {
    override fun areItemsTheSame(oldItem: User, newItem: User): Boolean {
        return oldItem.id == newItem.id
    }
    
    override fun areContentsTheSame(oldItem: User, newItem: User): Boolean {
        return oldItem == newItem
    }
}

class UserListAdapter(
    private val onItemClick: (User) -> Unit
) : ListAdapter<User, UserViewHolder>(UserDiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return UserViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(getItem(position), onItemClick) { }
    }
}

// Usage
adapter.submitList(newList)  // DiffUtil automatically calculates differences
```

**Benefits of ListAdapter:**
- Automatic difference calculation
- Smooth animations when list changes
- Better performance than `notifyDataSetChanged()`

## Multiple View Types

Display different item types in one RecyclerView:

```kotlin
sealed class ListItem {
    data class Header(val title: String) : ListItem()
    data class UserItem(val user: User) : ListItem()
    data class AdItem(val adContent: String) : ListItem()
}

class MultiTypeAdapter : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    
    private val items = mutableListOf<ListItem>()
    
    companion object {
        private const val TYPE_HEADER = 0
        private const val TYPE_USER = 1
        private const val TYPE_AD = 2
    }
    
    override fun getItemViewType(position: Int): Int {
        return when (items[position]) {
            is ListItem.Header -> TYPE_HEADER
            is ListItem.UserItem -> TYPE_USER
            is ListItem.AdItem -> TYPE_AD
        }
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            TYPE_HEADER -> {
                val binding = ItemHeaderBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
                HeaderViewHolder(binding)
            }
            TYPE_USER -> {
                val binding = ItemUserBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
                UserItemViewHolder(binding)
            }
            TYPE_AD -> {
                val binding = ItemAdBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
                AdViewHolder(binding)
            }
            else -> throw IllegalArgumentException("Unknown view type")
        }
    }
    
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (val item = items[position]) {
            is ListItem.Header -> (holder as HeaderViewHolder).bind(item)
            is ListItem.UserItem -> (holder as UserItemViewHolder).bind(item)
            is ListItem.AdItem -> (holder as AdViewHolder).bind(item)
        }
    }
    
    override fun getItemCount() = items.size
    
    fun submitList(newItems: List<ListItem>) {
        items.clear()
        items.addAll(newItems)
        notifyDataSetChanged()
    }
}

// ViewHolders
class HeaderViewHolder(private val binding: ItemHeaderBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(header: ListItem.Header) {
        binding.headerText.text = header.title
    }
}

class UserItemViewHolder(private val binding: ItemUserBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(userItem: ListItem.UserItem) {
        binding.nameText.text = userItem.user.name
        binding.emailText.text = userItem.user.email
    }
}

class AdViewHolder(private val binding: ItemAdBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(ad: ListItem.AdItem) {
        binding.adText.text = ad.adContent
    }
}
```

## Item Decorations

Add spacing, dividers, or custom decorations:

```kotlin
// Simple divider
val divider = DividerItemDecoration(this, DividerItemDecoration.VERTICAL)
binding.recyclerView.addItemDecoration(divider)

// Custom spacing decoration
class SpacingItemDecoration(private val spacing: Int) : RecyclerView.ItemDecoration() {
    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        outRect.left = spacing
        outRect.right = spacing
        outRect.bottom = spacing
        
        // Add top margin only for first item
        if (parent.getChildAdapterPosition(view) == 0) {
            outRect.top = spacing
        }
    }
}

// Usage
binding.recyclerView.addItemDecoration(SpacingItemDecoration(16.dpToPx()))

// Extension function for dp to px conversion
fun Int.dpToPx(): Int {
    return (this * Resources.getSystem().displayMetrics.density).toInt()
}
```

## Swipe to Delete

```kotlin
class SwipeToDeleteCallback(
    private val adapter: UserAdapter
) : ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.LEFT or ItemTouchHelper.RIGHT) {
    
    override fun onMove(
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder,
        target: RecyclerView.ViewHolder
    ): Boolean = false
    
    override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
        val position = viewHolder.adapterPosition
        adapter.removeUser(position)
    }
    
    override fun onChildDraw(
        c: Canvas,
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder,
        dX: Float,
        dY: Float,
        actionState: Int,
        isCurrentlyActive: Boolean
    ) {
        if (actionState == ItemTouchHelper.ACTION_STATE_SWIPE) {
            val itemView = viewHolder.itemView
            
            // Draw red background
            val paint = Paint().apply {
                color = Color.RED
            }
            
            if (dX > 0) {
                c.drawRect(
                    itemView.left.toFloat(),
                    itemView.top.toFloat(),
                    dX,
                    itemView.bottom.toFloat(),
                    paint
                )
            } else {
                c.drawRect(
                    itemView.right.toFloat() + dX,
                    itemView.top.toFloat(),
                    itemView.right.toFloat(),
                    itemView.bottom.toFloat(),
                    paint
                )
            }
        }
        
        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive)
    }
}

// Usage
val itemTouchHelper = ItemTouchHelper(SwipeToDeleteCallback(adapter))
itemTouchHelper.attachToRecyclerView(binding.recyclerView)
```

## Pagination (Load More)

```kotlin
class PaginationScrollListener(
    private val layoutManager: LinearLayoutManager,
    private val onLoadMore: () -> Unit
) : RecyclerView.OnScrollListener() {
    
    override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
        super.onScrolled(recyclerView, dx, dy)
        
        val visibleItemCount = layoutManager.childCount
        val totalItemCount = layoutManager.itemCount
        val firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition()
        
        if ((visibleItemCount + firstVisibleItemPosition) >= totalItemCount
            && firstVisibleItemPosition >= 0
        ) {
            onLoadMore()
        }
    }
}

// Usage
binding.recyclerView.addOnScrollListener(
    PaginationScrollListener(layoutManager as LinearLayoutManager) {
        loadMoreUsers()
    }
)
```

## Practical Example: Social Media Feed

```kotlin
// Data models
data class Post(
    val id: Int,
    val author: User,
    val content: String,
    val imageUrl: String?,
    val timestamp: Long,
    val likes: Int,
    val comments: Int,
    val isLiked: Boolean = false
)

// ViewHolder
class PostViewHolder(private val binding: ItemPostBinding) : RecyclerView.ViewHolder(binding.root) {
    
    fun bind(
        post: Post,
        onLikeClick: (Post) -> Unit,
        onCommentClick: (Post) -> Unit,
        onShareClick: (Post) -> Unit,
        onProfileClick: (User) -> Unit
    ) {
        // Author info
        binding.authorName.text = post.author.name
        binding.timestamp.text = formatTimestamp(post.timestamp)
        
        // Post content
        binding.contentText.text = post.content
        
        // Post image
        if (post.imageUrl != null) {
            binding.postImage.visibility = View.VISIBLE
            // Load image with Glide or Coil
        } else {
            binding.postImage.visibility = View.GONE
        }
        
        // Engagement stats
        binding.likeCount.text = "${post.likes} likes"
        binding.commentCount.text = "${post.comments} comments"
        
        // Like button state
        val likeIcon = if (post.isLiked) {
            R.drawable.ic_favorite_filled
        } else {
            R.drawable.ic_favorite_border
        }
        binding.likeButton.setImageResource(likeIcon)
        
        // Click listeners
        binding.likeButton.setOnClickListener { onLikeClick(post) }
        binding.commentButton.setOnClickListener { onCommentClick(post) }
        binding.shareButton.setOnClickListener { onShareClick(post) }
        binding.authorName.setOnClickListener { onProfileClick(post.author) }
        binding.authorAvatar.setOnClickListener { onProfileClick(post.author) }
    }
    
    private fun formatTimestamp(timestamp: Long): String {
        val now = System.currentTimeMillis()
        val diff = now - timestamp
        
        return when {
            diff < 60000 -> "Just now"
            diff < 3600000 -> "${diff / 60000}m ago"
            diff < 86400000 -> "${diff / 3600000}h ago"
            else -> "${diff / 86400000}d ago"
        }
    }
}

// Adapter
class PostAdapter : ListAdapter<Post, PostViewHolder>(PostDiffCallback()) {
    
    var onLikeClick: ((Post) -> Unit)? = null
    var onCommentClick: ((Post) -> Unit)? = null
    var onShareClick: ((Post) -> Unit)? = null
    var onProfileClick: ((User) -> Unit)? = null
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostViewHolder {
        val binding = ItemPostBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return PostViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: PostViewHolder, position: Int) {
        holder.bind(
            getItem(position),
            onLikeClick ?: {},
            onCommentClick ?: {},
            onShareClick ?: {},
            onProfileClick ?: {}
        )
    }
}

class PostDiffCallback : DiffUtil.ItemCallback<Post>() {
    override fun areItemsTheSame(oldItem: Post, newItem: Post) = oldItem.id == newItem.id
    override fun areContentsTheSame(oldItem: Post, newItem: Post) = oldItem == newItem
}

// Activity
class FeedActivity : AppCompatActivity() {
    private lateinit var binding: ActivityFeedBinding
    private lateinit var adapter: PostAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFeedBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        loadPosts()
    }
    
    private fun setupRecyclerView() {
        adapter = PostAdapter().apply {
            onLikeClick = { post -> handleLike(post) }
            onCommentClick = { post -> openComments(post) }
            onShareClick = { post -> sharePost(post) }
            onProfileClick = { user -> openProfile(user) }
        }
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@FeedActivity)
            adapter = this@FeedActivity.adapter
            addItemDecoration(SpacingItemDecoration(8.dpToPx()))
        }
        
        // Pull to refresh
        binding.swipeRefresh.setOnRefreshListener {
            refreshPosts()
        }
    }
    
    private fun loadPosts() {
        // Simulate loading posts
        val posts = generateSamplePosts()
        adapter.submitList(posts)
    }
    
    private fun handleLike(post: Post) {
        val updatedPost = post.copy(
            isLiked = !post.isLiked,
            likes = if (post.isLiked) post.likes - 1 else post.likes + 1
        )
        
        val currentList = adapter.currentList.toMutableList()
        val index = currentList.indexOfFirst { it.id == post.id }
        if (index != -1) {
            currentList[index] = updatedPost
            adapter.submitList(currentList)
        }
    }
    
    private fun openComments(post: Post) {
        val intent = Intent(this, CommentsActivity::class.java).apply {
            putExtra("POST_ID", post.id)
        }
        startActivity(intent)
    }
    
    private fun sharePost(post: Post) {
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, post.content)
        }
        startActivity(Intent.createChooser(shareIntent, "Share post"))
    }
    
    private fun openProfile(user: User) {
        val intent = Intent(this, ProfileActivity::class.java).apply {
            putExtra("USER_ID", user.id)
        }
        startActivity(intent)
    }
    
    private fun refreshPosts() {
        // Simulate refresh
        Handler(Looper.getMainLooper()).postDelayed({
            loadPosts()
            binding.swipeRefresh.isRefreshing = false
        }, 1500)
    }
    
    private fun generateSamplePosts(): List<Post> {
        // Sample data generation
        return listOf(
            Post(
                id = 1,
                author = User(1, "Alice Johnson", "alice@example.com"),
                content = "Just finished my first Android app! 🎉",
                imageUrl = null,
                timestamp = System.currentTimeMillis() - 3600000,
                likes = 42,
                comments = 8
            ),
            // More posts...
        )
    }
}
```

## Key Takeaways

✅ RecyclerView efficiently recycles views for smooth scrolling  
✅ Use ViewBinding for type-safe view access in ViewHolders  
✅ ListAdapter with DiffUtil provides automatic, efficient updates  
✅ Different LayoutManagers enable various layouts (list, grid, staggered)  
✅ ItemDecoration adds spacing, dividers, and custom decorations  
✅ ItemTouchHelper enables swipe and drag-and-drop  
✅ Handle clicks in ViewHolder for better separation of concerns  

## Practice Exercise

Create a product catalog app with:
1. Grid layout showing product cards
2. Different view types (header, product, ad)
3. Pull to refresh functionality
4. Swipe to add to favorites
5. Pagination for loading more products
6. Click handlers for viewing product details

## Next Steps

Next, we'll explore Navigation and Fragments for building multi-screen apps!

---

**Resources:**
- [RecyclerView Guide](https://developer.android.com/guide/topics/ui/layout/recyclerview)
- [ListAdapter and DiffUtil](https://developer.android.com/reference/androidx/recyclerview/widget/ListAdapter)
- [ItemTouchHelper](https://developer.android.com/reference/androidx/recyclerview/widget/ItemTouchHelper)